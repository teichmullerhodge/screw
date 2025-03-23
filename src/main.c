#include "declarations/declarations.h"
#include "helpers.h"
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>

typedef struct {

  char name[64];
  char **arguments;
  char command[10];
  bool useC;
  s32 argumentCounter;
} ScrewProject;

u8 new_project(ScrewProject *proj, s32 argc, char **argv) {
  if (argc < 2 || (argc == 2 && strcmp(argv[1], "help") != 0)) {
    usage();
  }
  if (strcmp(argv[1], "help") == 0) {
    display_help();
    return 0;
  }
  if (strcmp(argv[1], "new") == 0) {
    if (argc < 3) {
      display_help();
      return -1;
    }
    strncpy(proj->command, "new\0", 5);
    printf("%s\n", proj->command);
  }
  if (strcmp(argv[1], "build") == 0) {
    strncpy(proj->command, "build\0", 6);
    printf("%s\n", proj->command);
  }
  if (strcmp(argv[1], "run") == 0) {
    strncpy(proj->command, "run\0", 5);
    printf("%s\n", proj->command);
  }

  strncpy(proj->name, argv[2], sizeof(argv[2] - 1));
  printf("%s\n", proj->name);

  proj->argumentCounter = argc;
  proj->useC = true;
  bool usesCodeSpecifier = argc >= 3;
  if (usesCodeSpecifier) {
    bool isValidSpecifier =
        strcmp(argv[3], "c") == 0 || strcmp(argv[3], "cpp") == 0;
    if (!isValidSpecifier) {
      panic_noerrno("Specify a valid flag. The flags are c/cpp");
    }
    proj->useC = strcmp(argv[3], "c") == 0;
    printf("%d\n", proj->useC);
  }
  printf("End of new_project");
  return 0;
}
s32 create_file_on_project(const char *filename, char *projectName) {

  char fileBuffer[64];
  sprintf(fileBuffer, "%s/%s", projectName, filename);
  s32 command = execlp("touch", "touch", fileBuffer, (char *)NULL);
  return command;
}

s32 create_project(bool useC, char *projectName) {
  (void)useC;

  s32 executed = 0;
  create_pid();
  executed = create_file_on_project(".gitignore", projectName);
  if (executed < 0) {
    panic_noerrno("Error creating file on the project: ");
  }
  printf("Creating the project file\n");
  create_pid();
  executed = create_file_on_project(projectName, projectName);
  if (executed < 0) {
    panic_noerrno("Error creating file on the project: ");
  }
  printf("Creating the project Makefile\n");
  create_pid();
  executed = create_file_on_project("Makefile", projectName);
  if (executed < 0) {
    panic_noerrno("Error creating file on the project: ");
  }

  return 0;
}

u8 handle_command(ScrewProject *proj) {

  if (strcmp(proj->command, "new") == 0) {
    s32 dir = mkdir(proj->name, STANDARD_PERMISION);
    if (dir < 0) {
      panic("Error creating the directory");
    }
    if (strlen(proj->name) > 32) {
      perror("The project name should have less than 32 characters.");
      return -1;
    }

    s32 project = create_project(proj->useC, proj->name);
    if (project != 0) {
      panic_noerrno("Error creating project.\n");
    }
  }

  return 0;
}

s32 main(int argc, char **argv) {

  ScrewProject project = {0};
  u8 result = new_project(&project, argc, argv);
  if (result == 0) {
    handle_command(&project);
  }

  return result;
}