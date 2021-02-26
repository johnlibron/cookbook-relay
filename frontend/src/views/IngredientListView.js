import gql from "graphql-tag";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { Button, Col, Container, Row, Table } from "react-bootstrap";

const query = gql`
  query IngredientListViewSearch(
    $name: String
    $notes: String
    $categoryName: String
  ) {
    allIngredients(
      name_Icontains: $name
      notes_Icontains: $notes
      category_Name_Icontains: $categoryName
    ) {
      edges {
        node {
          id
          name
          notes
          category {
            id
            name
          }
        }
      }
    }
  }
`;

class IngredientListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      notes: null,
      categoryName: null,
      ingredients: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.handleSearch();
    this.setState({
      isLoading: false,
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleSearch() {
    this.props.client
      .query({
        query: query,
        variables: {
          name: this.state.name,
          notes: this.state.notes,
          categoryName: this.state.categoryName,
        },
      })
      .then((result) => {
        const ingredients = [];
        if (
          result.data.allIngredients &&
          result.data.allIngredients.edges.length > 0
        ) {
          let counter = 0;
          const ids = [];
          result.data.allIngredients.edges.forEach(function (element) {
            if (!ids.includes(element.node.id)) {
              ids.push(element.node.id);
              ingredients.push({
                number: ++counter,
                id: element.node.id,
                name: element.node.name,
                notes: element.node.notes,
                categoryName: element.node.category.name,
              });
            }
          });
        }
        this.setState({
          ingredients: ingredients,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading...</div>;
    }
    return (
      <Row>
        <Container>
          <Row>
            <Col>
              <input
                id="name"
                className="form-control"
                type="text"
                placeholder="Ingredient name"
                onChange={this.handleChange}
              />
            </Col>
            <Col>
              <input
                id="notes"
                className="form-control"
                type="text"
                placeholder="Notes"
                onChange={this.handleChange}
              />
            </Col>
            <Col>
              <input
                id="categoryName"
                className="form-control"
                type="text"
                placeholder="Category Name"
                onChange={this.handleChange}
              />
            </Col>
            <Col>
              <Button onClick={() => this.handleSearch()}>Search</Button>
            </Col>
          </Row>
          <br />
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Notes</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {this.state.ingredients.map((item) => (
                  <tr key={item.id}>
                    <td>{item.number}</td>
                    <td>{item.name}</td>
                    <td>{item.notes}</td>
                    <td>{item.categoryName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>
      </Row>
    );
  }
}

export default withApollo(IngredientListView);
