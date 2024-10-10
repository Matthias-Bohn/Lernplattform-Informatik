let arr = [[1, 223, 312, 154, 47, 124, 236, 334], [103, 401, 14, 236, 56], [20, 312, 235, 17, 124, 32]];

function hasAccess(id, room) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 1; j < arr[i].length; j++) {
      if (arr[i][0] == id && arr[i][j] == room) {
        return true;
      }
    }
  }
  return false;
}

console.log(hasAccess(3,236));