import React from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from 'reactstrap';

import './Modal.scss';

class ShowMoreAlbumImagesModal extends React.Component {
  state = {
    activeIndex: 0,
    imagesToShow: []
  }

  componentDidMount(){
    const {images} = this.props
    this.setState({imagesToShow: images })
  }

  componentDidUpdate({ images }) {
    if (this.props.images !== images) {
      this.setState({ imagesToShow: images });
    }
  };
  onExiting = () => {
    this.animating = true;
  }

  onExited = () => {
    this.animating = false;
  }

  next = () => {
    const {images} = this.props;
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === images.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous = () => {
    const {images} = this.props;
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? images.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex = (newIndex) => {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }
  toggleModal = () => {
    const { toggleModalOpen } = this.props;
    toggleModalOpen();
  };

  render() {
    const { activeIndex} = this.state;
    const { images } = this.props;
    const slides = images.map((image, i) => (
      <CarouselItem
        onExiting={this.onExiting}
        onExited={this.onExited}
        key={i}
      >
        <img src={image.resource_url} alt={image.resource_url} />
      </CarouselItem>
    ))

    return (
      <div className="ShowMoreAlbumImagesModal">
        <ModalBody>
          <Carousel
            interval={false}
            slide={true}
            activeIndex={activeIndex}
            next={this.next}
            previous={this.previous}
          >
            <CarouselIndicators items={images} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
          </Carousel>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" value="delete" onClick={this.toggleModal}>Close</Button>
        </ModalFooter>
      </div>
    )
  }
};

export default ShowMoreAlbumImagesModal;
