## Query String

This is not an Angular thing, this is a web thing.

It is one way to embed data in a url. There are three:

https://www.steel-co.com/products

https://www.company.com/products/sku/839389839/sales

- https [https | http] - "scheme"
- www.company.com - "server", "origin", "authority"
- products/sku/839389839/sales - "path" (path to the resource)

- the path: /products/sku/{:id}/sales
  - /products
  - /sku/{:id}
  - /sku/{:id}/sales?gt=5000

- query string: /products?source=argentina
  - almost always a way to filter a collection resource
- fragments: /products/?source=argentina#phone-number

/tools?discipline=electrical (empty set)
/tools/plumbing - 404
/tools/electrical - 404

Sir Tim Berners Lee - "Good URLs live forever"
