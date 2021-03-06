import {
  Gallery, GalleryItem, GalleryImage
} from "../Gallery"
import {Loading} from "../Elements"


describe("GalleryImage component", () => {
  const props = {alt: "alt",
    sizes: {
      SIZE_640: "SIZE_640.jpg",
      SIZE_1024: "SIZE_1024.jpg",
      SIZE_1440: "SIZE_1440.jpg"
    }}

  const wrapper = shallow(<GalleryImage {...props}/>)

  describe("source images are defined", () => {

    it("<960px", () => {
      expect(wrapper.findWhere(e => e.prop("srcSet") === props.sizes.SIZE_1024).length).toBe(1)
    })

    it("<1280px", () => {
      expect(wrapper.findWhere(e => e.prop("srcSet") === props.sizes.SIZE_1440).length).toBe(1)
    })

    describe("default image", () => {
      it("has src", () => {
        expect(wrapper.find("img").prop("src")).toBe(props.sizes.SIZE_640)
      })

      it("alt is defined", () => {
        expect(wrapper.find("img").prop("alt")).toBe(props.alt)
      })
    })
  })

})

describe("GalleryItem component", () => {
  const props = {
    title: "title",
    desc: "desc",
    SIZE_640: "SIZE_640.jpg",
    SIZE_1024: "SIZE_1024.jpg",
    SIZE_1440: "SIZE_1440.jpg"
  }
  const wrapper = shallow(<GalleryItem {...props}/>)

  it("renders correctly", () => {
    expect(wrapper).toMatchSnapshot()
  })

  it("no description, only show picture", () => {
    wrapper.setProps({desc: null})
    expect(wrapper.find(".img-wrapper").length).toBe(0)
  })

})

describe("Gallery component", () => {
  const props = {galleries: {}, path: "/path"}
  const wrapper = shallow(<Gallery {...props}/>)

  it("renders correctly", () => {
    expect(wrapper).toHaveLength(1)
  })

  it("shows Loading when no items", () => {
    expect(wrapper.find(Loading).length).toBe(1)
  })

  it("renders elements", () => {
    wrapper.setProps({galleries: {path: [0,1]}})
    expect(wrapper.prop("children").length).toBe(2)
  })

})

