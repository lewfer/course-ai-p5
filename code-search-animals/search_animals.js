animals = ["giraffe", "monkey", "rabbit", "dolphin", "frog"]


function setup() {
  search("dolphin")
  search("kangaroo")
}


function search(item) {
  for (animal of animals) {
    if (animal==item) {
      print(item, "found")
      return
    }
  }
  print(item, "not found")
}
  
