#include "declarations/declarations.h"
#include "helpers.h"
#include <asm-generic/errno-base.h>
#include <errno.h>
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
    strncpy(proj->command, "new", 5);
    proj->command[sizeof(proj->command) - 1] = '\0';
  }
  if (strcmp(argv[1], "build") == 0) {
    strncpy(proj->command, "build", 6);
    proj->command[sizeof(proj->command) - 1] = '\0';
  }
  if (strcmp(argv[1], "run") == 0) {
    strncpy(proj->command, "run", 5);
    proj->command[sizeof(proj->command) - 1] = '\0';
  }

  strncpy(proj->name, argv[2], sizeof(proj->name) - 1);
  proj->name[sizeof(proj->name) - 1] = '\0';

  proj->argumentCounter = argc;
  proj->useC = true;
  bool usesCodeSpecifier = argc >= 4;
  if (usesCodeSpecifier) {
    bool isValidSpecifier =
        strcmp(argv[3], "c") == 0 || strcmp(argv[3], "cpp") == 0;
    if (!isValidSpecifier) {
      panic_noerrno("Specify a valid flag. The flags are c/cpp");
    }
    proj->useC = strcmp(argv[3], "c") == 0;
  }
  return 0;
}
s32 create_file_on_project(const char *filename, char *projectName,
                           bool onSrc) {

  u16 maxlenSize = strlen(filename) + strlen(projectName) + 6; // /src/\0
  u16 sourcePathSize = strlen(projectName) + 5;                // /src\0
  char *fullPath = malloc(maxlenSize);
  if (fullPath == NULL) {
    panic_noerrno("Allocation for path failed. Retry.");
  }

  if (onSrc) {
    char *sourcePath = malloc(sourcePathSize);
    snprintf(sourcePath, sourcePathSize, "%s/%s", projectName, "src");
    s32 dir = mkdir(sourcePath, STANDARD_PERMISION);
    if (dir < 0 && errno != EEXIST) {
      panic("Error creating the directory\n");
    }
    free(sourcePath);
  }

  snprintf(fullPath, maxlenSize, onSrc ? "%s/src/%s" : "%s/%s", projectName,
           filename);

  FILE *file;
  file = fopen(fullPath, "w");
  if (file == NULL) {
    panic_noerrno("Error creating files for the project.");
  }
  fclose(file);
  free(fullPath);
  return 0;
}

s32 create_project(bool useC, char *projectName) {

  s32 created = 0;
  created = create_file_on_project(".gitignore", projectName, false);
  if (created < 0) {
    panic_noerrno("Error creating file on the project: ");
  }

  u16 allocateSize = strlen(projectName) + (useC ? 3 : 5);

  char *entryPoint = malloc(allocateSize);
  snprintf(entryPoint, allocateSize, "%s.%s", projectName, useC ? "c" : "cpp");
  created = create_file_on_project(entryPoint, projectName, true);
  if (created < 0) {
    panic_noerrno("Error creating file on the project: ");
    free(entryPoint);
  }

  char *headerFile = malloc(allocateSize);
  snprintf(headerFile, allocateSize, "%s.%s", projectName, useC ? "h" : "hpp");
  created = create_file_on_project(headerFile, projectName, true);
  if (created < 0) {
    panic_noerrno("Error creating file on the project: ");
    free(headerFile);
  }

  created = create_file_on_project("Makefile", projectName, true);
  if (created < 0) {
    panic_noerrno("Error creating file on the project: ");
  }

  free(entryPoint);
  free(headerFile);
  return 0;
}

bool handle_command(ScrewProject *proj) {

  if (strcmp(proj->command, "new") == 0) {
    s32 dir = mkdir(proj->name, STANDARD_PERMISION);
    if (dir < 0 && errno != EEXIST) {
      panic("Error creating the directory\n");
    }
    if (strlen(proj->name) > 32) {
      perror("The project name should have less than 32 characters.");
      return -1;
    }

    u16 buildPathSize = strlen(proj->name) + 7; // build/

    char projectName[64];
    strncpy(projectName, proj->name, sizeof(projectName) - 1);
    projectName[sizeof(projectName) - 1] = '\0';

    snprintf(projectName, buildPathSize, "%s/%s", proj->name, "build");
    dir = mkdir(projectName, STANDARD_PERMISION);
    if (dir < 0 && errno != EEXIST) {
      panic("Error creating the directory\n");
    }

    s32 project = create_project(proj->useC, proj->name);
    if (project != 0) {
      panic_noerrno("Error creating project.\n");
    }
  }

  return true;
}

s32 main(int argc, char **argv) {

  ScrewProject project = {0};
  u8 result = new_project(&project, argc, argv);
  if (result == 0) {
    bool operationOk = handle_command(&project);
    if (operationOk == true) {

      printf("Project created successfully.\n");
      return 0;
    }
  }

  printf("Error creating the project.\n");

  return result;
}