---
title: Math Library - Gyro
author: letsmoe
date: 18.04.2022
description: Documentation for the Gyro Math library
---

{%
	table = toc("Table of Contents");
%}

# Math
The `Math` library allows for advanced arithmetic operations implemented in Machine Code for optimal performance.

{{table}}

## Matrix Operations

### Matrix Multiplication
Multiplies one matrix of dimension `m x n` with another of dimension `n x p` to produce a matrix of dimension `p x m`.

<center>
$$
\begin{bmatrix}
	a_{11} & a_{12} & \cdots & a_{1n}\\
	a_{21} & a_{22} & \cdots & a_{2n}\\ 
	\vdots & \vdots & \ddots & \vdots\\ 
	a_{m1} & a_{m2} & \cdots & a_{mn} 
\end{bmatrix}
\times
\begin{bmatrix}
	b_{11} & b_{12} & \cdots & b_{1p}\\
	b_{21} & b_{22} & \cdots & b_{2p}\\ 
	\vdots & \vdots & \ddots & \vdots\\ 
	b_{n1} & b_{n2} & \cdots & b_{np} 
\end{bmatrix}
=
\begin{bmatrix}
	c_{11} & c_{12} & \cdots & c_{1p}\\
	c_{21} & c_{22} & \cdots & c_{2p}\\ 
	\vdots & \vdots & \ddots & \vdots\\ 
	c_{m1} & c_{m2} & \cdots & c_{mp} 
\end{bmatrix}
$$
</center>

```gyro
	matrix<2,2>: m1 = matrix(2, 2, [1, 2, 3, 4]);
	matrix<2,3>: m2 = matrix(2, 3, [5, 6, 7, 8, 9, 10]);
	matrix<3,2>: newMatrix = Matrix->multiply(m1, m2);
	print(newMatrix);
	# [[21, 24, 27], 
	# [47, 54, 61]];
```

## Vector Geometry