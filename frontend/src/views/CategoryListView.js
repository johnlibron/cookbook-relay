import gql from "graphql-tag";
import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Row, Table } from "react-bootstrap";

const QUERY_ALL_CATEGORIES = gql`
  query {
    allCategories {
      id
      name
      ingredients {
        id
        name
      }
    }
  }
`;

class CategoryListView extends Component {
  render() {
    let { data } = this.props;
    if (data.loading || !data.allCategories) {
      return <div>Loading...</div>;
    }
    return (
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
            {data.allCategories.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  {item.ingredients.map((ingredient, index) => (
                    <span>{(index ? ", " : "") + ingredient.name}</span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    );
  }
}

CategoryListView = graphql(QUERY_ALL_CATEGORIES)(CategoryListView);
export default CategoryListView;
