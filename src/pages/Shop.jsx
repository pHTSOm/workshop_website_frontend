import React, { useState, useEffect, useCallback } from "react";
import CommonSection from "../components/UI/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";
import "../styles/shop.css";
import ProductsList from "../components/UI/ProductsList";
import { useLocation } from "react-router-dom";
import mockProducts from "../assets/data/products";

const Shop = () => {
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();

  // Extract unique categories and brands from mock data
  useEffect(() => {
    setCategories([...new Set(mockProducts.map((item) => item.category))]);
    setBrands([...new Set(mockProducts.map((item) => item.brand))]);
  }, []);

  // Filtering and pagination logic
  const filterAndPaginate = (page = 1, filterParams = {}) => {
    setLoading(true);
    let filtered = [...mockProducts];
    if (filterParams.category) {
      filtered = filtered.filter((p) => p.category === filterParams.category);
    }
    if (filterParams.brand) {
      filtered = filtered.filter((p) => p.brand === filterParams.brand);
    }
    if (filterParams.search) {
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(filterParams.search.toLowerCase())
      );
    }
    if (filterParams.minPrice) {
      filtered = filtered.filter(
        (p) => p.price >= parseFloat(filterParams.minPrice)
      );
    }
    if (filterParams.maxPrice) {
      filtered = filtered.filter(
        (p) => p.price <= parseFloat(filterParams.maxPrice)
      );
    }
    if (filterParams.sort) {
      switch (filterParams.sort) {
        case "price_asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "name_asc":
          filtered.sort((a, b) => a.productName.localeCompare(b.productName));
          break;
        case "name_desc":
          filtered.sort((a, b) => b.productName.localeCompare(a.productName));
          break;
        case "newest":
          filtered.sort((a, b) => b.id - a.id);
          break;
        case "rating":
        case "bestselling":
          // No rating/bestselling in mock, so skip or implement if needed
          break;
        default:
          break;
      }
    }
    // Special filters
    if (filterParams.isNew) {
      filtered = filtered.filter((p) => p.isNew);
    }
    if (filterParams.isBestSeller) {
      filtered = filtered.filter((p) => p.isBestSeller);
    }
    // Pagination
    const limit = 12;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);
    setProducts(paginated);
    setTotalPages(totalPages);
    setCurrentPage(page);
    setLoading(false);
  };

  // Sync with URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "";
    const brand = params.get("brand") || "";
    const search = params.get("search") || "";
    const min = params.get("minPrice") || "";
    const max = params.get("maxPrice") || "";
    const sort = params.get("sort") || "";
    const page = params.has("page") ? parseInt(params.get("page")) : 1;
    setSelectedCategory(category);
    setSelectedBrand(brand);
    setSearchTerm(search);
    setMinPrice(min);
    setMaxPrice(max);
    setSortOption(sort);
    setCurrentPage(page);
    const filterParams = {
      category,
      brand,
      search,
      minPrice: min,
      maxPrice: max,
      sort,
      page,
    };
    if (params.has("isNew")) filterParams.isNew = params.get("isNew");
    if (params.has("isBestSeller"))
      filterParams.isBestSeller = params.get("isBestSeller");
    const cleanParams = Object.fromEntries(
      Object.entries(filterParams).filter(([_, v]) => v !== "")
    );
    filterAndPaginate(page, cleanParams);
  }, [location.search]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      const filterParams = {
        category: selectedCategory,
        brand: selectedBrand,
        search: value,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sort: sortOption,
      };
      const cleanParams = Object.fromEntries(
        Object.entries(filterParams).filter(([_, v]) => v !== "")
      );
      filterAndPaginate(1, cleanParams);
    }, 500),
    [selectedCategory, selectedBrand, minPrice, maxPrice, sortOption]
  );

  const handleFilter = (e) => {
    e.preventDefault();
    const filterParams = {
      category: selectedCategory,
      brand: selectedBrand,
      search: searchTerm,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sort: sortOption,
    };
    const cleanParams = Object.fromEntries(
      Object.entries(filterParams).filter(([_, v]) => v !== "")
    );
    filterAndPaginate(1, cleanParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("");
    filterAndPaginate(1, {});
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    filterAndPaginate(page, {
      category: selectedCategory,
      brand: selectedBrand,
      search: searchTerm,
      minPrice: minPrice,
      maxPrice: maxPrice,
      sort: sortOption,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Helmet title="Shop">
      <CommonSection title="Computer Components" />
      <section>
        <Container>
          <Row>
            {/* Filters Sidebar */}
            <Col lg="3" md="4" className="mb-4">
              <div className="filter__widget">
                <h4 className="filter__title">Filter Products</h4>
                <Form onSubmit={handleFilter}>
                  {/* Category Filter */}
                  <FormGroup className="mb-3">
                    <Label for="category">Category</Label>
                    <Input
                      type="select"
                      id="category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  {/* Brand Filter */}
                  <FormGroup className="mb-3">
                    <Label for="brand">Brand</Label>
                    <Input
                      type="select"
                      id="brand"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand, index) => (
                        <option key={index} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                  {/* Price Range Filter */}
                  <div className="price-range mb-3">
                    <Label>Price Range</Label>
                    <div className="d-flex">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="me-2"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="filter__buttons d-flex justify-content-between">
                    <Button color="primary" type="submit">
                      Apply Filters
                    </Button>
                    <Button
                      color="secondary"
                      type="button"
                      onClick={handleClearFilters}
                    >
                      Clear
                    </Button>
                  </div>
                </Form>
              </div>
            </Col>
            {/* Main Content Area */}
            <Col lg="9" md="8">
              <div className="shop__toolbar d-flex align-items-center justify-content-between mb-4">
                {/* Search Bar */}
                <div className="search__box">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      debouncedSearch(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && filterAndPaginate(1)}
                  />
                  <span onClick={() => filterAndPaginate(1)}>
                    <i className="ri-search-line"></i>
                  </span>
                </div>
                {/* Sort Options */}
                <div className="sort__widget">
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value);
                      const sortValue = e.target.value;
                      const filterParams = {
                        category: selectedCategory,
                        brand: selectedBrand,
                        search: searchTerm,
                        minPrice: minPrice,
                        maxPrice: maxPrice,
                        sort: sortValue,
                      };
                      const cleanParams = Object.fromEntries(
                        Object.entries(filterParams).filter(
                          ([_, v]) => v !== ""
                        )
                      );
                      filterAndPaginate(1, cleanParams);
                    }}
                  >
                    <option value="">Default Sorting</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A-Z</option>
                    <option value="name_desc">Name: Z-A</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                    <option value="bestselling">Best Selling</option>
                  </select>
                </div>
              </div>
              {/* Product Display */}
              <div className="product__display">
                {loading ? (
                  <div className="text-center py-5">
                    <h5>Loading products...</h5>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-5">
                    <h4>No products found</h4>
                    <p>Try adjusting your filters or search terms.</p>
                  </div>
                ) : (
                  <Row>
                    <ProductsList data={products} />
                  </Row>
                )}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination__container d-flex justify-content-center mt-5">
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages).keys()].map((page) => (
                      <li
                        key={page + 1}
                        className={`page-item ${
                          currentPage === page + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page + 1)}
                        >
                          {page + 1}
                        </button>
                      </li>
                    ))}
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};
export default Shop;
