import gql from "graphql-tag";
import React, { Component } from "react";
import { withApollo } from "react-apollo";
import { Button, Col, Container, Row, Table } from "react-bootstrap";

const query = gql`
  query CategoriesListViewSearch($name: String, $ingredientName: String) {
    allCategories(
      name_Icontains: $name
      ingredients_Name_Icontains: $ingredientName
    ) {
      edges {
        node {
          id
          name
          ingredients {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

class CategoryListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      ingredientName: null,
      categories: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.handleSearch();
    this.setState({
      isLoading: false,
    });
  }

  handleSearch() {
    this.props.client
      .query({
        query: query,
        variables: {
          name: this.state.name,
          ingredientName: this.state.ingredientName,
        },
      })
      .then((result) => {
        const categories = [];
        if (
          result.data.allCategories &&
          result.data.allCategories.edges.length > 0
        ) {
          let counter = 0;
          const ids = [];
          result.data.allCategories.edges.forEach(function (element) {
            const ingredients = [];
            element.node.ingredients.edges.forEach(function (ingredient) {
              ingredients.push({
                id: ingredient.node.id,
                name: ingredient.node.name,
              });
            });
            if (!ids.includes(element.node.id)) {
              ids.push(element.node.id);
              categories.push({
                number: ++counter,
                id: element.node.id,
                name: element.node.name,
                ingredients: ingredients,
              });
            }
          });
        }
        this.setState({
          categories: categories,
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
                className="form-control"
                type="text"
                placeholder="Category name"
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </Col>
            <Col>
              <input
                className="form-control"
                type="text"
                placeholder="Ingredient Name"
                onChange={(e) =>
                  this.setState({ ingredientName: e.target.value })
                }
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
                  <th>Ingredients</th>
                </tr>
              </thead>
              <tbody>
                {this.state.categories.map((item) => (
                  <tr key={item.id}>
                    <td>{item.number}</td>
                    <td>{item.name}</td>
                    <td>
                      {item.ingredients.map((ingredient, index) => (
                        <span key={ingredient.id}>
                          {(index ? ", " : "") + ingredient.name}
                        </span>
                      ))}
                    </td>
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

export default withApollo(CategoryListView);
