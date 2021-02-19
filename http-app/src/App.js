import React, { Component } from "react";
import "./App.css";
import axios from 'axios';

axios.interceptors.response.use(null, error => {
  console.log('Interceptior called')
  return Promise.reject(error)
});

const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';

class App extends Component {
  
  state = {
    posts: []
  };

  async componentDidMount() {

    //promise object = Objects Promiseare used for deferred and asynchronous computations.
    // One Promise represents an operation that is not yet completed, but will be in the future.
    //promise initially it in the pending state, when the operation completes, the state will be either resolved in case of success or
    // will be rejected in case of failure
    //output promise
    // const promise =  axios.get('https://jsonplaceholder.typicode.com/posts');
    //we dont actually need the promise object , we can just store the data we get from the api in a response object
    //const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    //but the response object also got a property called data, so we can descructure the object, pick the data wich is the array of 100 posts and rename it to "posts"
    //then we call the setState method and we update the array of posts
    //and then we will get the data rendered in the page
    const {data:posts} = await axios.get(apiEndpoint);
    this.setState({posts})
}
   handleAdd = async () => {
    //we need to send new data to the backend, the post object has 2 property, so we create the object with title and body
    //then we call the method of axios .post and we pass the endpoint and the object (post) we created
    //the server then will responde with the new created post
    const obj = { title: 'a', body: 'b' };
     const { data: post } = await axios.post(apiEndpoint, obj);
     console.log(post);
     //once you created the new post, you must show it in the table on the page
     //create an empty array, pass the new post and then copy the data from the actual array of posts of the state
     const posts = [post, ...this.state.posts];
     this.setState({ posts });
  };

  handleUpdate = async post => {
    //we choose to update the title of a post
    post.title = "UPDATED";
    //we use the put method of axios, we specify the endpoint and we must specify the id so he knows what post to update, then we pass the object
    await axios.put(apiEndpoint + "/" + post.id, post)
    //after that, we must update the state, so we copy in a new array , the array of posts
    //we search for the index of the post we updated
    //then we pass that index to the array and add the post that was updated, then update the state
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = {...post}
    this.setState({posts})

  };

  handleDelete = async post => {
    //when an error accured, example the delete fails, we must revert the UI to the previous state
    // by creating a costant with the previous state before the call to the server for deleting
    //N.B this implementation is  called optmistic update
    const originalPosts = this.state.posts;
    //we call the delete method, pass the endpoint and the id of the post we want to delete
    //we create a posts constant and we pass the array of posts in the state then we use the filter method to compare the id of the post 
    //we re deleting and the id of the post in the array
    //so we want all posts except that we are deleting
    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({ posts });
    //we surround the call the to the serve with a try catch, if the call fails, we show an error message and then return to the previous state
    try {
      await axios.delete(apiEndpoint + '/999' + post.id);
      
    }
    catch (ex) {
      console.log("Handle delete catch block")
      //expected errors are errors that api endpoint predict and return, example if we delete a post with an id that doesn't exist,the server will respond with 404
      //basic errors like 400, errors that are in the range of 400, are called CLIENT ERRORS
      //in this case we have to display a specific error message to the user
      //unexpected errors are errors that shouldn't happen under normal cicumstances
      //-If the network is down, we are not able to contact the server, the network should not be down, so is unexpected
      //-Or the network is up and the server is down, or both of this are up and the database is down, or all of these are up but there is a bug
      //For solving these kinda errors we must :
      // - Log them
      // - Display a generic and friendly error message example "something unexpected happen"
      //exception has two props, response and request, now we are checking the response down below
      if (ex.response && ex.response.status === 404) 
        alert('This post has already been deleted')  
      else {
        console.log('Logging the error', ex)
        alert('An unexpected error occured.')
      }
     
      this.setState({posts:originalPosts})
    }
   
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
