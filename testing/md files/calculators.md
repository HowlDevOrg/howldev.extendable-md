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

The following features the rounddigits function and the throwifoutsiderange, which takes in a number and is inclusive on both sides (num1 &lt;= x &lt;= num2). Separated by commas. 

```calculator
angle: number
radius: number = 1
---
throwifoutsiderange angle, 0, 360
assign x = rounddigits(cos(degtorad(angle)) * radius, 2)
assign y = rounddigits(sin(degtorad(angle)) * radius, 2)
return x, y
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
---

Below is a speed calculator that shows off conditional outputs (where the function can return different things/amounts of things based on the parameters of the inputs). This is shown off with a boolean input, and if you check it, you can see how much faster you can move at a given mph than at a 60 mph travel time, or how much time in a journey you would save.

These are really just showcases, I don't claim to have great ideas for how to use this, I just hope one of these inspires you for how you want to use this functionality. 

```calculator
mph: number = 60
runAgainst: boolean
minutesAt60: number = 40
---
assign spm = rounddigits((60 / mph) * 60, 2)

if runAgainst
assign laterSpeed = rounddigits((60 / mph) * minutesAt60, 2)
return spm as Seconds Per Mile, laterSpeed as New Time
else 
return spm as Seconds Per Mile
endif
```