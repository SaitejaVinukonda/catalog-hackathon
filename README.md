# catalog-hackathon
Here’s a **README.md** you can use for your project.
It’s written so that anyone can understand what the program does, how it uses **Lagrange interpolation**, and how to run it with your JSON input file.

---

````markdown
# Polynomial Constant Finder using Lagrange Interpolation

## 📌 Overview
This project reads test cases from a **JSON file** containing a set of `(x, y)` coordinates.  
The goal is to find the **constant term** `c` of the polynomial equation that passes through the given points using the **Lagrange interpolation formula**.

In the JSON file:
- Each point has:
  - `base`: the numerical base of the given value (e.g., base 2, base 4, base 10, etc.)
  - `value`: the coordinate value in that base
- The `keys` section defines:
  - `n`: total number of points available
  - `k`: number of points to be used in interpolation

The program:
1. Reads and parses the JSON input.
2. Converts the values to decimal from their given base.
3. Uses **Lagrange interpolation** to compute the constant term `c` (value of the polynomial at `x = 0`).
4. Prints **live step-by-step calculations**.

---

## 📂 Example JSON Input
```json
{
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
}
````

Here:

* The x-coordinates are the JSON keys `"1"`, `"2"`, `"3"`, `"6"`.
* The y-values are stored in `value` and are converted from their respective bases.

---

## 🧮 Lagrange Interpolation Formula

Given `n` points $(x_1, y_1), (x_2, y_2), \dots, (x_n, y_n)$:

$$
P(x) = \sum_{i=1}^{n} y_i \cdot L_i(x)
$$

where:

$$
L_i(x) = \prod_{\substack{1 \leq j \leq n \\ j \neq i}} \frac{x - x_j}{x_i - x_j}
$$

To find the **constant term**:

$$
c = P(0) = \sum_{i=1}^{n} y_i \cdot \prod_{\substack{1 \leq j \leq n \\ j \neq i}} \frac{-x_j}{x_i - x_j}
$$

---

## ▶ How to Run

### 1. Save the JSON file

Save your test data in `input.json`.

### 2. Compile and Run (Java Example)

```bash
javac PolynomialConstantFinder.java
java PolynomialConstantFinder input.json
```

---

## 📤 Sample Output

```
Reading JSON file: input.json

Converted Points (in decimal):
(x=1, y=4)
(x=2, y=7)
(x=3, y=12)
(x=6, y=39)

Step-by-step Lagrange calculations for P(0):

For i=1: y=4
  L1(0) = ((0-2)/(1-2)) * ((0-3)/(1-3)) * ((0-6)/(1-6)) = ...
  Contribution = y * L1(0) = ...

For i=2: y=7
  L2(0) = ...
  Contribution = ...

...
Final constant term c = 20.0

## 📜 Notes

* Works for any number of points provided in JSON.
* Handles different number bases for y-values.
* Prints detailed steps for transparency.
