import React, { Component } from "react";
import "./App.css";
import axios from 'axios';

axios.interceptors.response.use(null, error => {
  console.log('Interceptior called')
  return Promise.reject(error)
});

const apiEndpoint = 'http://localhost:8000/api/post';

class App extends Component {
  
  state = {
    posts: [],
    addFormVisible: false,
    updatePostVisible: false,
    newPostId: "",
    newPostTitle: "",
    newPostBody: "",
    newPostAuthor: "",
    updatedPostTitle: "",
    updatedPostBody: ""
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
    this.handleGetAll();
  }
  
  toggleAddPostForm = async () => {
    this.setState({ addFormVisible: !this.state.addFormVisible });
  }

  handleGetAll = async () => {
    await axios.get(apiEndpoint).then((data) => {
      this.setState({posts: data.data})
    });
  }

   handleAdd = async () => {
    //we need to send new data to the backend, the post object has 2 property, so we create the object with title and body
    //then we call the method of axios .post and we pass the endpoint and the object (post) we created
    //the server then will responde with the new created post
    const post = { 
      postId: this.state.newPostId,
      postTitle: this.state.newPostTitle,
      postBody: this.state.newPostBody,
      postAuthor: this.state.newPostAuthor
    };
    await axios.post(apiEndpoint, post).then(() => {
      this.handleGetAll();
      this.toggleAddPostForm();
    });
    
  };

  toggleUpdatePostVisible = (e) => {
    this.setState({ updatePostVisible: !this.state.updatePostVisible });
    if (!this.state.updatePostVisible) {
      var currentPost = this.state.posts.filter((post) => {
        return post.id !== e.currentTarget.dataset.id;
      });
      console.log(currentPost)
      this.setState({ updatedPostTitle: currentPost[0].postTitle });
      this.setState({ updatedPostBody: currentPost[0].postBody });
    }
  }

  handleUpdate = async e => {


    var putPost = {
      _id: e.currentTarget.dataset.id,
      post: {
        postTitle: this.state.updatedPostTitle,
        postBody: this.state.updatedPostBody
      }
    }

   
    await axios.put(apiEndpoint, putPost).then((data) => {
      this.handleGetAll();
      this.setState({ updatePostVisible: !this.state.updatePostVisible });
    });
    

  };

  handleDelete = async post => {
    //when an error accured, example the delete fails, we must revert the UI to the previous state
    // by creating a costant with the previous state before the call to the server for deleting
    //N.B this implementation is  called optmistic update
    //we call the delete method, pass the endpoint and the id of the post we want to delete
    //we create a posts constant and we pass the array of posts in the state then we use the filter method to compare the id of the post 
    //we re deleting and the id of the post in the array
    //so we want all posts except that we are deleting
    
    //we surround the call the to the serve with a try catch, if the call fails, we show an error message and then return to the previous state
    try {
      await axios.delete(`${apiEndpoint}/${post._id}`).then((data) => {
        this.handleGetAll();
      });
      
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
     
    }
   
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary m-2" onClick={this.toggleAddPostForm}>
          Add post
        </button>
        {this.state.addFormVisible && (
          <div>
            <br />
            <input className="form-control" type="text" placeholder="Post id" id="post-id" value={this.state.newPostId} onChange={(e) => {this.setState({newPostId: e.currentTarget.value})}}/>
            <br />
            <input className="form-control" type="text" placeholder="Post title" id="post-title" value={this.state.newPostTitle} onChange={(e) => {this.setState({newPostTitle: e.currentTarget.value})}} />
            <br />
            <textarea className="form-control" placeholder="Post body" id="post-body" rows="5" value={this.state.newPostBody} onChange={(e) => {this.setState({newPostBody: e.currentTarget.value})}}/>
            <br />
            <input className="form-control" type="text" placeholder="Post Author" id="post-author" value={this.state.newPostAuthor} onChange={(e) => {this.setState({newPostAuthor: e.currentTarget.value})}}/>
            <br />
            <button className="btn btn-success m-2" onClick={this.toggleAddPostForm}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={this.handleAdd}>
              Confirm
            </button>
            <br />
          </div>
        )}
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Body</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post._id}>
                <td>
                  {!this.state.updatePostVisible && (
                    post.postTitle
                  )}
                  {this.state.updatePostVisible && (
                    <input className="form-control" value={this.state.updatedPostTitle}  onChange={(e) => {this.setState({updatedPostTitle: e.currentTarget.value})}}/>
                  )}
                  
                </td>
                <td>
                  
                  {!this.state.updatePostVisible && (
                    post.postBody
                  )}
                  {this.state.updatePostVisible && (
                    <textarea rows="5" className="form-control" value={this.state.updatedPostBody}  onChange={(e) => {this.setState({updatedPostBody: e.currentTarget.value})}}/> 
                  )}
                </td>
                <td>
                   {!this.state.updatePostVisible && (
                    <button
                      className="btn btn-info btn-sm"
                      onClick={(e) => this.toggleUpdatePostVisible(e)}
                      data-id={post._id}
                    >
                      Update
                    </button>
                  )}
                  
                  {this.state.updatePostVisible && (
                    <div>
                       <button
                      className="btn btn-info btn-sm m-2"
                      onClick={(e) => this.handleUpdate(e)}
                      data-id={post._id}
                    >
                      Save
                    </button>
                     <button
                     className="btn btn-info btn-sm"
                     onClick={() => this.toggleUpdatePostVisible()}
                   >
                   Cancel
                 </button>
                   </div>
                  )}
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
