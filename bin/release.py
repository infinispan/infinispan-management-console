#!/usr/bin/python
import re
import sys
import os
import os.path
import subprocess
import shutil
import tempfile
from datetime import *
from multiprocessing import Process
from utils import *

try:
  from xml.etree.ElementTree import ElementTree
except:
  prettyprint('''
        Welcome to the Infinispan Release Script.
        This release script requires that you use at least Python 2.5.0.  It appears
        that you do not have the ElementTree XML APIs available, which are available
        by default in Python 2.5.0.
        ''', Levels.FATAL)
  sys.exit(1)

modules = []
uploader = None
git = None

def help_and_exit():
    prettyprint('''
        Welcome to the Infinispan Release Script.
        
%s        Usage:%s
        
            $ bin/release.py <version> <branch to tag from> <--mvn-only>
            
%s        E.g.,%s
        
            $ bin/release.py 6.1.1.Beta1 %s<-- this will tag off master.%s
            
            $ bin/release.py 6.1.1.Beta1 6.1.x %s<-- this will use the appropriate branch.%s

            $ bin/release.py 6.1.1.Beta1 6.1.x --mvn-only %s<-- this will only tag and release to maven (no dstribution).%s

    ''' % (Colors.yellow(), Colors.end_color(), Colors.yellow(), Colors.end_color(), Colors.green(), Colors.end_color(), Colors.green(), Colors.end_color(), Colors.green(), Colors.end_color()), Levels.INFO)
    sys.exit(0)

def validate_version(version):  
  version_pattern = get_version_pattern()
  if version_pattern.match(version):
    return version.strip()
  else:
    prettyprint("Invalid version '"+version+"'!\n", Levels.FATAL)
    help_and_exit()

def tag_release(version, branch):
  if git.remote_branch_exists():
    git.switch_to_branch()
    git.create_tag_branch()
  else:
    prettyprint("Branch %s cannot be found on upstream repository.  Aborting!" % branch, Levels.FATAL)
    sys.exit(100)

def get_project_version_tag(tree):
  return tree.find("./{%s}version" % (maven_pom_xml_namespace))

def get_parent_version_tag(tree):
  return tree.find("./{%s}parent/{%s}version" % (maven_pom_xml_namespace, maven_pom_xml_namespace))

def get_properties_version_tag(tree):
  return tree.find("./{%s}properties/{%s}project-version" % (maven_pom_xml_namespace, maven_pom_xml_namespace))

def write_pom(tree, pom_file):
  tree.write("tmp.xml", 'UTF-8')
  in_f = open("tmp.xml")
  out_f = open(pom_file, "w")
  try:
    for l in in_f:
      newstr = l.replace("ns0:", "").replace(":ns0", "").replace("ns1", "xsi")
      out_f.write(newstr)
  finally:
    in_f.close()
    out_f.close()
    os.remove("tmp.xml")    
  if settings['verbose']:
    prettyprint(" ... updated %s" % pom_file, Levels.INFO)

def patch(pom_file, version):
  '''Updates the version in a POM file.  We need to locate //project/parent/version, //project/version and 
  //project/properties/project-version and replace the contents of these with the new version'''
  if settings['verbose']:
    prettyprint("Patching %s" % pom_file, Levels.DEBUG)
  tree = ElementTree()
  tree.parse(pom_file)    
  need_to_write = False
  
  tags = []
  tags.append(get_parent_version_tag(tree))
  tags.append(get_project_version_tag(tree))
  tags.append(get_properties_version_tag(tree))
  
  for tag in tags:
    if tag != None and "-SNAPSHOT" in tag.text:
      if settings['verbose']:
        prettyprint("%s is %s.  Setting to %s" % (str(tag), tag.text, version), Levels.DEBUG)
      tag.text=version
      need_to_write = True
    
  if need_to_write:
    # write to file again!
    write_pom(tree, pom_file)
    return True
  else:
    if settings['verbose']:
      prettyprint("File doesn't need updating; nothing replaced!", Levels.DEBUG)
    return False

def get_poms_to_patch(working_dir):
  poms_to_patch = [working_dir + "/pom.xml"]
  return poms_to_patch

def update_versions(base_dir, version):
  os.chdir(base_dir)
  poms_to_patch = get_poms_to_patch(".")
  
  modified_files = []
  for pom in poms_to_patch:
    if patch(pom, version):
      modified_files.append(pom)
  pieces = re.compile('[\.\-]').split(version)
  snapshot = pieces[3]=='SNAPSHOT'
  final = pieces[3]=='Final'
  
  # Now make sure this goes back into the repository.
  git.commit(modified_files, "'Release Script: update versions for %s'" % version)
  
  # And return the next version
  if final:
    return pieces[0] + '.' + pieces[1] + '.' + str(int(pieces[2])+ 1) + '-SNAPSHOT'
  else:
    return None

def get_module_name(pom_file):
  tree = ElementTree()
  tree.parse(pom_file)
  return tree.findtext("./{%s}artifactId" % maven_pom_xml_namespace)

def do_task(target, args, async_processes):
  if settings['multi_threaded']:
    async_processes.append(Process(target = target, args = args))
  else:
    target(*args)

### This is the starting place for this script.
def release():
  global settings
  global uploader
  global git
  assert_python_minimum_version(2, 5)
  require_settings_file()
    
  # We start by determining whether the version passed in is a valid one
  if len(sys.argv) < 2:
    help_and_exit()
  
  base_dir = os.getcwd()
  version = validate_version(sys.argv[1])
  branch = "master"

  mvn_only = False
  if len(sys.argv) > 2:
    if sys.argv[2].startswith("--mvn-only"):
       mvn_only = True
    else:
      branch = sys.argv[2]

  if len(sys.argv) > 3:
     if sys.argv[3].startswith("--mvn-only"):
       mvn_only = True
     else:
       prettyprint("Unknown argument %s" % sys.argv[3], Levels.WARNING)
       help_and_exit()

  prettyprint("Releasing Infinispan Management Console version %s from branch '%s'" % (version, branch), Levels.INFO)
  sure = input_with_default("Are you sure you want to continue?", "N")
  if not sure.upper().startswith("Y"):
    prettyprint("... User Abort!", Levels.WARNING)
    sys.exit(1)
  prettyprint("OK, releasing! Please stand by ...", Levels.INFO)
  
  ## Set up network interactive tools
  if settings['dry_run']:
    # Use stubs
    prettyprint("*** This is a DRY RUN.  No changes will be committed.  Used to test this release script only. ***", Levels.DEBUG)
    prettyprint("Your settings are %s" % settings, Levels.DEBUG)
    uploader = DryRunUploader()
  else:
    uploader = Uploader()
  
  git = Git(branch, version)
  if not git.is_upstream_clone():
    proceed = input_with_default('This is not a clone of an %supstream%s Infinispan Management Console repository! Are you sure you want to proceed?' % (Colors.UNDERLINE, Colors.END), 'N')
    if not proceed.upper().startswith('Y'):
      prettyprint("... User Abort!", Levels.WARNING)
      sys.exit(1)

  ## Make sure we don't include un-needed content in the release

  prettyprint("Step 1: Cleaning up working directory (un-tracked and modified files)", Levels.INFO)
  git.clean_release_directory()
  prettyprint("Step 1: Complete", Levels.INFO)
      
  ## Release order:
  # Step 1: Tag in Git
  prettyprint("Step 2: Tagging %s in git as %s" % (branch, version), Levels.INFO)
  tag_release(version, branch)
  prettyprint("Step 2: Complete", Levels.INFO)
  
  # Step 2: Update version in tagged files
  prettyprint("Step 3: Updating version number in source files", Levels.INFO)
  version_next = update_versions(base_dir, version)
  prettyprint("Step 3: Complete", Levels.INFO)
  
  # Step 3: Build and test in Maven2
  prettyprint("Step 4: Build and test in Maven2", Levels.INFO)
  maven_build_distribution(version)
  prettyprint("Step 4: Complete", Levels.INFO)

  ## Tag the release
  git.tag_for_release()

  step_no=5
  
  # Switch back to the branch being released
  git.switch_to_branch()
  
  # Update to next version
  if version_next is not None:
    prettyprint("Step %s: Updating version number for next release" % step_no, Levels.INFO)
    update_versions(base_dir, version_next)
    prettyprint("Step %s: Complete" % step_no, Levels.INFO)

  if not settings['dry_run']:
    git.push_tag_to_origin()
    if version_next is not None:
      git.push_branch_to_origin()
    git.cleanup()
  else:
    prettyprint("In dry-run mode.  Not pushing tag to remote origin and not removing temp release branch %s." % git.working_branch, Levels.DEBUG)
  
  prettyprint("\n\n\nDone!", Levels.INFO)

if __name__ == "__main__":
  release()
