import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Alert,
} from "reactstrap";
import { useParams, Link } from "react-router-dom";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import "../styles/product-details.css";
import { motion } from "framer-motion";
import ProductsList from "../components/UI/ProductsList";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import mockProducts from "../assets/data/products";
import { addItemToCart } from "../slices/cartSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews] = useState([]); // No backend reviews
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("desc");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Review form state (frontend only, no submit)
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitting] = useState(false);
  const [reviewError] = useState("");

  // Additional images state
  const [mainImage, setMainImage] = useState("");
  const [thumbnails, setThumbnails] = useState([]);

  // Fetch product from mock data
  useEffect(() => {
    setLoading(true);
    const productId = parseInt(id);
    const foundProduct = mockProducts.find((p) => p.id === productId);
    setProduct(foundProduct || null);
    if (foundProduct && foundProduct.imgUrl && foundProduct.imgUrl.length > 0) {
      setMainImage(foundProduct.imgUrl[0]);
      setThumbnails(foundProduct.imgUrl);
    } else {
      setMainImage(require("../assets/images/placeholder.png"));
      setThumbnails([require("../assets/images/placeholder.png")]);
    }
    // Related products (same category, exclude self)
    if (foundProduct) {
      setRelatedProducts(
        mockProducts.filter(
          (p) =>
            p.category === foundProduct.category && p.id !== foundProduct.id
        )
      );
    } else {
      setRelatedProducts([]);
    }
    setLoading(false);
  }, [id]);

  // Review form (frontend only, no backend)
  const renderReviewForm = () => {
    return (
      <div>
        <h4 className="mb-3">Write a Review</h4>
        <Alert color="info" className="mb-3">
          Review functionality is disabled in demo mode.
        </Alert>
        <p className="mb-3">
          Posting as <strong>Guest</strong>
        </p>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormGroup className="rating__group">
            <Label>Your Rating</Label>
            <div className="rating-stars">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={index < reviewRating ? "filled" : ""}
                  style={{ cursor: "not-allowed", opacity: 0.6 }}
                >
                  <i
                    className={`ri-star-${
                      index < reviewRating ? "fill" : "line"
                    }`}
                  ></i>
                </span>
              ))}
            </div>
            <small className="text-muted">
              You must be logged in to rate products. (Demo only)
            </small>
          </FormGroup>
          <FormGroup>
            <Label for="reviewText">Your Review</Label>
            <Input
              type="textarea"
              id="reviewText"
              placeholder="Share your experience with this product..."
              rows="5"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              disabled
            />
          </FormGroup>
          <Button color="primary" type="submit" disabled>
            Submit Review
          </Button>
        </Form>
      </div>
    );
  };

  const handleQuantityChange = (operation) => {
    if (operation === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (operation === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;

    let basePrice = parseFloat(product.price);

    if (selectedVariant && selectedVariant.additionalPrice) {
      basePrice += parseFloat(selectedVariant.additionalPrice);
    }

    return (basePrice * quantity).toFixed(2);
  };

  // Update the addToCart function in ProductDetails.jsx
  const addToCart = () => {
    // Check if product has variants but none is selected
    if (
      product.ProductVariants &&
      product.ProductVariants.length > 0 &&
      !selectedVariant
    ) {
      toast.warning("Please select a variant");
      return;
    }

    // Prepare cart item with variant information
    const itemData = {
      productId: product.id,
      variantId: selectedVariant ? selectedVariant.id : null,
      quantity: quantity,
    };

    dispatch(addItemToCart(itemData))
      .unwrap()
      .then(() => {
        toast.success("Product added to cart");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add product to cart");
      });
  };

  // Handle thumbnail click for image gallery
  const handleThumbnailClick = (imageUrl) => {
    setMainImage(imageUrl);
  };

  if (loading) {
    return (
      <Helmet title="Loading...">
        <CommonSection title="Product Details" />
        <section className="pt-0">
          <Container>
            <div className="text-center py-5">
              <h5>Loading product details...</h5>
            </div>
          </Container>
        </section>
      </Helmet>
    );
  }

  if (!product) {
    return (
      <Helmet title="Product Not Found">
        <CommonSection title="Product Details" />
        <section className="pt-0">
          <Container>
            <div className="text-center py-5">
              <h4>Product not found</h4>
              <p>
                The product you are looking for does not exist or has been
                removed.
              </p>
              <Link to="/shop" className="back-to-shop-btn">
                <i className="ri-arrow-left-line"></i> Back to Shop
              </Link>
            </div>
          </Container>
        </section>
      </Helmet>
    );
  }

  return (
    <Helmet title={product.productName}>
      <CommonSection title={product.productName} />

      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <div className="product-images">
                <div className="main-image-container">
                  <img
                    src={mainImage || "/placeholder.png"}
                    alt={product.productName}
                    className="main-product-image"
                    onError={(e) => {
                      e.target.src = "/placeholder.png";
                    }}
                  />
                </div>

                {/* Thumbnails */}
                <div className="product-thumbnails">
                  {thumbnails.length > 0
                    ? thumbnails.map((imageUrl, index) => (
                        <div
                          key={index}
                          className={`thumbnail ${
                            mainImage === imageUrl ? "active" : ""
                          }`}
                          onClick={() => handleThumbnailClick(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt={`${product.productName} - view ${index + 1}`}
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                        </div>
                      ))
                    : // Fallback thumbnails when no images are available
                      [...Array(4)].map((_, index) => (
                        <div key={index} className="thumbnail">
                          <img src="/placeholder.png" alt="Product view" />
                        </div>
                      ))}
                </div>
              </div>
            </Col>

            <Col lg="6">
              <div className="product__details">
                <h2>{product.productName}</h2>

                <div className="product__meta d-flex gap-3 align-items-center mb-3">
                  <span className="product-category badge bg-primary">
                    {product.category}
                  </span>
                  <span className="product-brand badge bg-secondary">
                    {product.brand}
                  </span>

                  {product.isNew && (
                    <span className="badge bg-success">New</span>
                  )}
                  {product.isBestSeller && (
                    <span className="badge bg-warning">Bestseller</span>
                  )}
                </div>

                <div className="product__rating d-flex align-items-center gap-2 mb-3">
                  {[...Array(5)].map((_, index) => (
                    <span key={index}>
                      <i
                        className={`ri-star-${
                          index < Math.round(product.avgRating || 0)
                            ? "fill"
                            : "line"
                        }`}
                      ></i>
                    </span>
                  ))}
                  <span className="rating__text">
                    ({product.avgRating ? product.avgRating.toFixed(1) : "0"})
                    Rating
                  </span>
                </div>

                <div className="product__price mb-3">
                  <h4 className="price-display">
                    ${calculateTotalPrice()}
                    {selectedVariant && (
                      <span className="base-price">
                        Base: ${parseFloat(product.price).toFixed(2)}
                      </span>
                    )}
                  </h4>
                </div>

                <p className="product__short-desc mb-4">{product.shortDesc}</p>

                {/* Product Variants */}
                {product.ProductVariants &&
                  product.ProductVariants.length > 0 && (
                    <div className="product__variants mb-4">
                      <h5>Available Options</h5>
                      <div className="variant-options">
                        {product.ProductVariants.map((variant) => (
                          <div
                            key={variant.id}
                            className={`variant-option ${
                              selectedVariant?.id === variant.id
                                ? "selected"
                                : ""
                            }`}
                            onClick={() => handleVariantChange(variant)}
                          >
                            <span className="variant-name">{variant.name}</span>
                            {variant.additionalPrice > 0 && (
                              <span className="variant-price">
                                +$
                                {parseFloat(variant.additionalPrice).toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Quantity Selector */}
                <div className="quantity__wrapper d-flex align-items-center gap-3 mb-4">
                  <h6>Quantity:</h6>
                  <div className="quantity__control d-flex align-items-center">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange("decrease")}
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span className="quantity">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange("increase")}
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  className="buy__btn"
                  onClick={addToCart}
                >
                  Add to Cart
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Reviews ({reviews.length})
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{product.description}</p>
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrapper">
                    <h4 className="mb-4">Customer Reviews</h4>

                    {reviews.length === 0 ? (
                      <p>
                        No reviews yet. Be the first to review this product!
                      </p>
                    ) : (
                      <ul className="review__list">
                        {reviews.map((review) => (
                          <li key={review.id} className="review__item mb-4">
                            <div className="review__header d-flex justify-content-between">
                              <div>
                                <h5>{review.userName}</h5>
                                {review.rating && (
                                  <div className="review-rating">
                                    {[...Array(5)].map((_, index) => (
                                      <span key={index}>
                                        <i
                                          className={`ri-star-${
                                            index < review.rating
                                              ? "fill"
                                              : "line"
                                          }`}
                                        ></i>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="review-date">
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="review-text mt-2">{review.comment}</p>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="review__form mt-5">
                      {renderReviewForm()}
                    </div>
                  </div>
                </div>
              )}
            </Col>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <Col lg="12" className="mt-5">
                <h2 className="related__title">You might also like</h2>
                <Row>
                  <ProductsList data={relatedProducts} />
                </Row>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
