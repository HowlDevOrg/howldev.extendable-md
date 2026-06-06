```calculator
angle: number
radius: number
---
throwifoutsiderange angle, 0, 360
assign x = cos(degtorad(angle))
assign y = sin(degtorad(angle))
return x, y
```