import React, { Component } from "react";
import axios from "axios";
import MyForm from "./MyForm";
import CustomerList from "./CustomerList";
import Loader from "./Loader";
import "./app.css";

class App extends Component {
  state = {
    customers: [],
    loader: false,
    customer: {},
    url: "http://localhost:5000/users"
  };

  getCustomers = async () => {
    this.setState({ loader: true });
    try {
      const response = await axios.get(this.state.url);
      this.setState({ customers: response.data, loader: false });
    } catch (error) {
      console.error("Error fetching customers:", error);
      this.setState({ loader: false });
    }
  };

  deleteCustomer = async id => {
    this.setState({ loader: true });
    try {
      await axios.delete(`${this.state.url}/${id}`);
      this.setState(prevState => ({
        customers: prevState.customers.filter(customer => customer.id !== id),
        loader: false
      }));
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(error.response.status === 404 ? "Customer not found" : "An error occurred");
    } finally {
      this.setState({ loader: false });
    }
  };
  
  createCustomer = async data => {
    this.setState({ loader: true });
    try {
      await axios.post(this.state.url, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      });
      this.setState(prevState => ({
        customers: [...prevState.customers, data],
        loader: false
      }));
    } catch (error) {
      console.error("Error creating customer:", error);
      alert(error.response.status === 500 ? "Email already exists" : "An error occurred");
    } finally {
      this.setState({ loader: false });
    }
  };
  
  deleteCustomer = async id => {
    this.setState({ loader: true });
    try {
      await axios.delete(`${this.state.url}/${id}`);
      this.getCustomers(); // Refresh customers after deletion
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(error.response.status === 404 ? "Customer not found" : "An error occurred");
    } finally {
      this.setState({ loader: false });
    }
  };
  
  createCustomer = async data => {
    this.setState({ loader: true });
    try {
      await axios.post(this.state.url, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      });
      this.getCustomers(); // Refresh customers after creation
    } catch (error) {
      console.error("Error creating customer:", error);
      alert(error.response.status === 500 ? "Email already exists" : "An error occurred");
    } finally {
      this.setState({ loader: false });
    }
  };
  
  editCustomer = async data => {
    this.setState({ loader: true });
    try {
      await axios.put(`${this.state.url}/${data.id}`, {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email
      });
      this.getCustomers(); // Refresh customers after editing
    } catch (error) {
      console.error("Error editing customer:", error);
    } finally {
      this.setState({ loader: false });
    }
  };
  
  

  componentDidMount() {
    this.getCustomers();
  }

  onDelete = id => {
    this.deleteCustomer(id);
  };

  onEdit = data => {
    this.setState({ customer: data });
  };

  onFormSubmit = data => {
    if (data.isEdit) {
      this.editCustomer(data);
    } else {
      this.createCustomer(data);
    }
  };

  render() {
    return (
      <div>
        <div className="ui fixed inverted menu">
          <div className="ui container">
            <a href="/#" className="header item">
              ReactJS CRUD with Node.js Sami uddin
            </a>
          </div>
        </div>
        <div className="ui main container">
          <MyForm onFormSubmit={this.onFormSubmit} customer={this.state.customer} />
          {this.state.loader ? <Loader /> : ""}
          <CustomerList customers={this.state.customers} onDelete={this.onDelete} onEdit={this.onEdit} />
        </div>
      </div>
    );
  }
}

export default App;
