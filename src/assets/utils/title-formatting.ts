export const formattedTitle = (title: string) => {
  let newTitle = ''
  let startNum = 0
  for (let i = 0, j = 0; i < title.length; i++, j++) {
    if (j === 19) {
      const temp = title.substring(startNum, i)
      newTitle = newTitle + temp + '\n'
      console.log(newTitle)
      j = 0
      startNum = i
    }
  }
  return newTitle
}
