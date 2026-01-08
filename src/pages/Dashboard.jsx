import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");
    const [editId, setEditId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleAdd = async () => {
        if (editId) {
            const res = await axios.put(
                `https://fakestoreapi.com/products/${editId}`,
                { title, price }
            );

            setProducts(products.map(p =>
                p.id === editId ? res.data : p
            ));
            setEditId(null);
        } else {
            const res = await axios.post("https://fakestoreapi.com/products", {
                title,
                price,
                description: "New product",
                image: "https://i.pravatar.cc",
                category: "electronics"
            });
            setProducts([res.data, ...products]);
        }

        setTitle("");
        setPrice("");
    };



    const handleUpdate = async () => {
        await axios.put(
            `https://fakestoreapi.com/products/${editId}`,
            { title, price }
        );

        setProducts((prevProducts) =>
            prevProducts.map((p) =>
                p.id === editId
                    ? { ...p, title, price } 
                    : p
            )
        );

        setIsModalOpen(false);
        setEditId(null);
        setTitle("");
        setPrice("");
    };



    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://fakestoreapi.com/products/${id}`);
            setProducts(products.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };


    useEffect(() => {
        axios
            .get("https://fakestoreapi.com/products")
            .then((res) => {
                console.log("API DATA:", res.data);
                setProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("API ERROR:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div style={{ padding: "30px" }}>
            <h2>Product Dashboard</h2>

            {loading && <p>Loading products...</p>}

            {!loading && products.length === 0 && (
                <p>No products found</p>
            )}


            <h3>Add Product</h3>

            <div className="add-row">
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <input
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <button className="add-btn" onClick={handleAdd}>
                    Add Product
                </button>
            </div>




            <table border="1" cellPadding="10" width="100%">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>${product.price}</td>
                            <td>{product.category}</td>
                            <td>
                                <button className="edit-btn"
                                    onClick={() => {
                                        setEditId(product.id);
                                        setTitle(product.title);
                                        setPrice(product.price);
                                        setIsModalOpen(true);
                                    }}
                                    style={{ marginRight: "8px" }}
                                >
                                    Edit
                                </button>

                            </td>
                            <td>


                                <button className="delete-btn" onClick={() => handleDelete(product.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Edit Product</h3>

                        <input
                            className="modal-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Product Title"
                        />

                        <input
                            className="modal-input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Product Price"
                        />

                        <div className="modal-actions">
                            <button className="btn-primary" onClick={handleUpdate}>
                                Update
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}




        </div>
    );
};

export default Dashboard;




