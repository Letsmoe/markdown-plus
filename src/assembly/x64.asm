section .data
	text db "Hello, World! This is ya boi!",10,0

section .text
	global _start

_start:
	mov rax, text
	call _print

	mov rax, 5
	call Factorial

	mov rax, 60
	syscall

Factorial:
	push rax
	ret


_print:
	push rax
	mov rbx, 0
_printLoop:
	inc rax
	inc rbx
	mov cl, [rax]
	cmp cl, 0
	jne _printLoop

	mov rax, 1
	mov rdi, 1
	pop rsi
	mov rdx, rbx
	syscall
	ret