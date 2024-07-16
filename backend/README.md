The API supports various query parameters for filtering:

1. Basic `where` format:
http://localhost:8006/leads?where[name][_operator]=LIKE&where[name][_value]=r

2. `OR` based filter:
http://localhost:8006/leads?where[name][_operator]=LIKE&where[name][_value]=r&where[email][_operator]=LIKE&where[email][_value]=deepak@homepapa.ca&whereSelection=or

3. `AND` based filter:
http://localhost:8006/leads?where[name][_operator]=LIKE&where[name][_value]=r&where[email][_operator]=LIKE&where[email][_value]=deepak@homepapa.ca&whereSelection=and

4. Operator based filter:
http://localhost:8006/leads?where[id][_operator]=<&where[id][_value]=10

You can replace `<` with any operator such as `<`, `>`, `LIKE`, `<=`, `>=`, etc.

Range based filter available in swagger api lead/get documentation