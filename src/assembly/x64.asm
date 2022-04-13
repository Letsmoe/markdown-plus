section .data
	text db "Hello, World!",10

section .text
	global _start

_start:
	hello_wold_size EQU $ - text

	mov rax, 1
	mov rsi, text
	mov rdx, hello_wold_size
	syscall

	mov rax, 60
	syscall