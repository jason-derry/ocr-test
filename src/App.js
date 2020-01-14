import React, { Component } from 'react';
import ImageUploader from 'react-images-upload';
import Tesseract from 'tesseract.js';
import { Button, Progress } from 'reactstrap';
import './App.css';

class App extends Component{
  constructor(){
    super();
    this.onDrop = this.onDrop.bind(this);
    this.scan = this.scan.bind(this);
    this.checkScanned = this.checkScanned.bind(this);


    this.state = {
      pictures: [],
      disabled: true,
      scanned: '',
      text: '',
      progress: 0
    }
  }

  onDrop(picture){
    this.setState({
      pictures: picture,
      disabled: false
    });
  }

  scan(){
    Tesseract.recognize(
      this.state.pictures[0],
      'eng',
      { logger: m => this.setState({ progress: m.progress }) }
    ).then(({ data: { text } }) => {
      this.setState({ scanned: text },
        () => { this.checkScanned(); }
        );
    });
  }

  checkScanned(){
    var str = this.state.scanned;
    console.log(str);
    if(str.includes('DRIVING LICENCE')){
      this.setState({ text: 'ADDRESS: ' + str.substring(str.indexOf('8. ')+3, str.indexOf('9. ')) });
    } else{
      // this.setState({ text: 'Not a valid driving licence.'});
      this.setState({ text: str });
    }
  }

  render(){
    return(
      <div>
        <ImageUploader
                withIcon={true}
                withPreview={true}
                buttonText='Choose images'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
            />
        <Button disabled={this.state.disabled} onClick={this.scan}>submit</Button>
        <Progress value={this.state.progress*100} />
        {this.state.text}
        {/* <Button onClick={this.checkScanned}>check</Button> */}

      </div>
    )
  }
}
export default App;
