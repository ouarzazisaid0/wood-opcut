from opcut.models.stock_item import StockItem
from opcut.models.order_item import OrderItem
from opcut.models.problem import Problem
from opcut.solver.solver import Solver

# Stock boards
stocks = [
    StockItem(length=2440, quantity=10)
]

# Required cuts (parts)
orders = [
    OrderItem(length=500, quantity=8),
    OrderItem(length=700, quantity=6),
    OrderItem(length=300, quantity=10)
]

# Create problem
problem = Problem(stocks=stocks, orders=orders)

# Solve
solver = Solver(problem)
solution = solver.solve()

# Show result
print("Total waste:", solution.total_waste)
for pattern in solution.patterns:
    print("\nPattern:")
    print("  Waste:", pattern.waste)
    print("  Cuts:", [cut.length for cut in pattern.cuts])
