import React, { Component } from 'react'
import { Grid, Dimmer, Loader as Load} from 'semantic-ui-react'


export default class Loader extends Component {

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column  key={1}>

                        <Dimmer active inverted>
                            <Load inverted content={this.props.loadText} />
                        </Dimmer>

                </Grid.Column>
            </Grid>            
        );
    }
}


