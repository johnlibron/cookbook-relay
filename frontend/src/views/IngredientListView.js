import gql from "graphql-tag";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Container, Row, Table } from "react-bootstrap";

const query = gql`
  query IngredientListViewSearch($name: String, $categoryName: String) {
    allIngredients(name_Icontains: $name, category_Name: $categoryName) {
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
      name: "",
      categoryName: "",
    };
  }

  handleSearch(e) {
    this.props
      .query({
        query: query,
        variables: {
          name: this.state.name,
          categoryName: this.state.categoryName,
        },
        fetchPolicy: "network-only",
      })
      .then((res) => {
        if (res.status === 200) {
          //   window.location.replace("/");
          console.log("Result: " + JSON.stringify(res));
        }
      })
      .catch((err) => {
        console.log("Network error: " + err);
      });
  }

  render() {
    let { data } = this.props;
    if (data.loading || !data.allIngredients) {
      return <div>Loading...</div>;
    }
    return (
      <Row>
        <Container>
          <Row>
            <input
              type="text"
              onChange={(e) => this.setState({ name: e.target.value })}
            />
            <input
              type="text"
              onChange={(e) => this.setState({ categoryName: e.target.value })}
            />
            <button onClick={() => this.handleSearch()}>Search</button>
          </Row>
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Notes</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {data.allIngredients.edges.map((item) => (
                  <tr key={item.node.id}>
                    <td>{item.node.name}</td>
                    <td>{item.node.notes}</td>
                    <td>{item.node.category.name}</td>
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

IngredientListView = graphql(query)(IngredientListView);
export default IngredientListView;
