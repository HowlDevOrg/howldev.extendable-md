Calculates the number of operations per second given a number of ___second values. 

```calculator
interval: Seconds | Milliseconds | Microseconds | Nanoseconds | Picoseconds
value: number = 1
---
if value <= 0
throw Value cannot be less than or equal to 0.
endif

switch interval
case "Seconds"
assign val = 1 / value 
case "Milliseconds"
assign val = 1000 / value 
case "Microseconds"
assign val = 1000000 / value 
case "Nanoseconds"
assign val = 1000000000 / value 
case "Picoseconds"
assign val = 1000000000000 / value 
endswitch
return rounddigits(val, 1) as Operations Per Second
```
---

The following features the rounddigits function which I have to use twice because of the ugly way that JS parses numbers to strings and what problems that causes with tiny numbers (1.0e-17), which breaks the operator regex. However, you can get around it (and maybe I'll figure out a clean solution in the future.. but generally don't try to deal with tiny numbers) by using the rounding function multiple times. 

It also features the throwifoutsiderange, which takes in a number and is inclusive on both sides (num1 &lt;= x &lt;= num2). Separated by commas. 

```calculator
angle: number
radius: number = 1
---
throwifoutsiderange angle, 0, 360
assign x = rounddigits(cos(degtorad(angle)), 5)
assign y = rounddigits(sin(degtorad(angle)), 5)
return rounddigits(x * radius, 2) as x, rounddigits(y * radius, 2) as y
```
---

BMI calculator. Features the boolean input type for the metric system, then a number for the height and weight (as well as another boolean for metric). It also has somewhat exhaustive error handling. 

Height is in inches or meters, weight is in pounds or kilograms. 

```calculator
metric: boolean = true
height: number = 1.775
weight: number = 72
---
if metric
assign val = weight / pow(height, 2)
else
assign val = 703 * weight / pow(height, 2)
endif

if val >= 30
assign name = "Obese"
elsif val >= 25
assign name = "Overweight"
elsif val >= 17
assign name = "Normal"
else
assign name = "Underweight"
endif

return val as BMI, name as Evaluation
```
---

Classic distance formula. 

```calculator
x1: number
y1: number
x2: number
y2: number
---
assign manhattan = rounddigits(abs(x2-x1) + abs(y2-y1), 2)
assign euclidean = rounddigits(sqrt(pow(x2-x1, 2) + pow(y2-y1, 2)), 2)
return manhattan as Manhattan Distance, euclidean as Euclidean Distance
```
---

String function showcase. 

```calculator
str1: string = "this"
str2: string = "that"
---
assign len = len(str1) + len(str2)
assign combination = str1 + str2
assign empty = isEmpty(str1)
assign notEmpty = isNotEmpty(str2)
return len, combination, empty, notEmpty
```