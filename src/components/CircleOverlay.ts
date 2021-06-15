import Vue from "vue";
import CircleItem from "./CircleItem"

export class CircleOverlay extends google.maps.OverlayView {
    private position_: google.maps.LatLng;
    private label_: string;
    private size_: number;
    private div_: HTMLElement | null;
    private circleComponent_: CircleItem;
    circle: HTMLDivElement | null;

    constructor(label: string, position: google.maps.LatLng, size: number) {
      super();

      // Initialize all properties.
      this.label_ = label;
      this.position_ = position;
      this.size_ = size;
      this.circleComponent_ = Vue.extend(CircleItem);

      const circleInstance = new this.circleComponent_({
        propsData: {
        letter: this.label_,
        width: this.size_,
        height: this.size_
        }
      });
      circleInstance.$mount();
      this.circle = circleInstance.$el;

      // Define a property to hold the image's div. We'll
      // actually create this div upon receipt of the onAdd()
      // method so we'll leave it null for now.
      this.div_ = null;
    }

    /**
     * onAdd is called when the map's panes are ready and the overlay has been
     * added to the map.
     */
    onAdd() {
      this.div_ = document.createElement("div");
      this.div_.style.borderStyle = "none";
      this.div_.style.borderWidth = "0px";
      this.div_.style.position = "absolute";

      this.div_.appendChild(this.circle);

      const panes = this.getPanes()!;
    //   panes.overlayLayer.appendChild(this.div_);
      panes.overlayMouseTarget.appendChild(this.div_);
    }

    draw() {
      // We use the south-west and north-east
      // coordinates of the overlay to peg it to the correct position and size.
      // To do this, we need to retrieve the projection from the overlay.
      const overlayProjection = this.getProjection();

      const pos = overlayProjection.fromLatLngToDivPixel(
        this.position_
      );

      // Resize the image's div to fit the indicated dimensions.
      if (this.div_) {
        this.div_.style.left = `${pos.x - this.size_/2}px`;
        this.div_.style.top = `${pos.y - this.size_/2}px`;
      }
    }

    /**
     * The onRemove() method will be called automatically from the API if
     * we ever set the overlay's map property to 'null'.
     */
    onRemove() {
      if (this.div_) {
        (this.div_.parentNode as HTMLElement).removeChild(this.div_);
        this.div_ = null;
      }
    }
  }