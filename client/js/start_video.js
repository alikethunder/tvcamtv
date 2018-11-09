export const start_video = async function (st, c, elId) {
  st ? st.getTracks().forEach(track => track.stop()) : false;
  if (c.video || c.audio) {
    await navigator.mediaDevices.getUserMedia(c)
      .then(function (stream) {
        st = stream;
        document.getElementById(elId).srcObject = stream;
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  return st
}