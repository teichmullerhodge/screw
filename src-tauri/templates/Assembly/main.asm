STDOUT equ 1
SYS_WRITE equ 1
SYS_EXIT equ 60

section .rodata

  msg db "Hello, world", 0xA
  msg_len equ $ - msg

section .text

global _start

_start:

  mov rdi, STDOUT
  mov rsi, msg
  mov rdx, msg_len
  mov rax, SYS_WRITE

  syscall

  mov rdi, 0
  mov rax, SYS_EXIT
  syscall
