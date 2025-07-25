import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Helmet from "../components/Helmet/Helmet";
import "../styles/home.css";
import { Container, Row, Col, Spinner } from "reactstrap";
import heroImg from "../assets/images/hero-pc.png";
import { Link } from "react-router-dom";
import Services from "../services/services";
import ProductsList from "../components/UI/ProductsList";
import Clock from "../components/UI/Clock";
import counterImg from "../assets/images/counter-timer-img.png";
import mockProducts from "../assets/data/products";

const Home = () => {
  const [newProducts, setNewProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [cpuProducts, setCpuProducts] = useState([]);
  const [gpuProducts, setGpuProducts] = useState([]);
  const [laptopProducts, setLaptopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const year = new Date().getFullYear();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const allProducts = mockProducts;
    setNewProducts(
      allProducts.filter((product) => product.isNew === true).slice(0, 4)
    );
    setBestSellerProducts(
      allProducts.filter((product) => product.isBestSeller === true).slice(0, 4)
    );
    setCpuProducts(
      allProducts.filter((product) => product.category === "CPU").slice(0, 4)
    );
    setGpuProducts(
      allProducts.filter((product) => product.category === "GPU").slice(0, 4)
    );
    setLaptopProducts(
      allProducts.filter((product) => product.category === "Laptop").slice(0, 4)
    );
    setLoading(false);
  }, []);

  // Function to render product sections consistently
  const renderProductSection = (title, products, category, isLight = false) => (
    <section className={`category__products ${isLight ? "bg-light" : ""}`}>
      <Container>
        <Row>
          <Col lg="12" className="text-center mb-5">
            <h2 className="section__title">{title}</h2>
          </Col>
          {loading ? (
            <Col lg="12" className="text-center py-5">
              <Spinner color="primary" />
            </Col>
          ) : error ? (
            <Col lg="12" className="text-center">
              <p className="text-danger">{error}</p>
            </Col>
          ) : products && products.length > 0 ? (
            <ProductsList data={products} />
          ) : (
            <Col lg="12" className="text-center">
              <p>No products found in this category</p>
            </Col>
          )}
          <Col lg="12" className="text-center mt-4">
            <Link to={`/shop?category=${category}`} className="view-all-link">
              View All {title} <i className="ri-arrow-right-line"></i>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );

  return (
    <Helmet title={"Home"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <p className="hero__subtitle">
                  High-Performance Computer Parts {year}
                </p>
                <h2>Build Your Dream PC With Premium Components</h2>
                <p>
                  Find the latest and most powerful computer components for
                  building or upgrading your PC. We provide comprehensive
                  computer solutions, including high-end CPUs, graphics cards,
                  storage, and peripherals.
                </p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                  <Link to="/shop">SHOP NOW</Link>
                </motion.button>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={heroImg} alt="Computer Components" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Services />
      {/* New Products Section */}
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">New Products</h2>
            </Col>
            {loading ? (
              <Col lg="12" className="text-center py-5">
                <Spinner color="primary" />
              </Col>
            ) : error ? (
              <Col lg="12" className="text-center">
                <p className="text-danger">{error}</p>
              </Col>
            ) : newProducts && newProducts.length > 0 ? (
              <ProductsList data={newProducts} />
            ) : (
              <Col lg="12" className="text-center">
                <p>No new products found</p>
              </Col>
            )}
            <Col lg="12" className="text-center mt-4">
              <Link to="/shop?isNew=true" className="view-all-link">
                View All New Products <i className="ri-arrow-right-line"></i>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Best Sellers Section */}
      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Best Sellers</h2>
            </Col>
            {loading ? (
              <Col lg="12" className="text-center py-5">
                <Spinner color="primary" />
              </Col>
            ) : error ? (
              <Col lg="12" className="text-center">
                <p className="text-danger">{error}</p>
              </Col>
            ) : bestSellerProducts && bestSellerProducts.length > 0 ? (
              <ProductsList data={bestSellerProducts} />
            ) : (
              <Col lg="12" className="text-center">
                <p>No best sellers found</p>
              </Col>
            )}
            <Col lg="12" className="text-center mt-4">
              <Link to="/shop?isBestSeller=true" className="view-all-link">
                View All Best Sellers <i className="ri-arrow-right-line"></i>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Timer section */}
      <section className="timer__count">
        <Container>
          <Row>
            <Col lg="6" md="12" className="count__down-col">
              <div className="clock__top-content">
                <h4 className="text-white fs-6 mb-2">Limited Offer</h4>
                <h3 className="text-white fs-5 mb-3">
                  High-Performance Gaming PC
                </h3>
              </div>
              <Clock />
              <motion.button
                whileTap={{ scale: 1.2 }}
                className="buy__btn store__btn"
              >
                <Link to="/shop">Visit Store</Link>
              </motion.button>
            </Col>
            <Col lg="6" md="12" className="text-end counter__img">
              <img src={counterImg} alt="Gaming PC" />
            </Col>
          </Row>
        </Container>
      </section>
      {/* Product Categories */}
      {renderProductSection("Laptops", laptopProducts, "Laptop")}
      {renderProductSection("Graphics Cards", gpuProducts, "GPU", true)}
      {renderProductSection("CPUs & Processors", cpuProducts, "CPU")}
    </Helmet>
  );
};

export default Home;
