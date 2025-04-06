#include "declarations/declarations.h"
#include <errno.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define STANDARD_PERMISION 0777

static inline void usage() {
  printf("Usage: screw [command]\n");
  printf("Type screw help for a list of commands\n");
  exit(0);
}

static inline void display_help() {
  // using puts, so i don't have to type \n every time.
  puts("\nCommands: new <project-name> [flags]");
  puts("Brief: Creates a new project on a new folder named after your project "
       "in the desired language.");
  puts("Flags: c/cpp, specifies if the project is in the C or C++ language. If "
       "the flag isn't provided the project is created in C.\n");
  puts("Commands: build [flags]");
  puts("Brief: Run the Makefile to build your project. It won't build if the "
       "src/Makefile file was moved or erased.");
  puts("Flags: dev/release, build your application with or without "
       "optimizations. Dev is assumed to be the standard if no flags are "
       "provided.\n");
  puts("Commands: run [flags]");
  puts("Brief: Runs the build file.");
  puts("Flags: dev/release, runs the application specified in the dev or "
       "release folder. Dev is assumed to be the standard.\n");
  exit(-1);
}

static inline void panic(const char *message) {
  printf("%s %s\n", message, strerror(errno));
  exit(-1);
}

static inline void panic_noerrno(const char *message) {
  printf("%s\n", message);
  exit(-1);
}

typedef enum {

  NEW,
  BUILD,
  RUN,
  HELP,

} ScrewCommands;
