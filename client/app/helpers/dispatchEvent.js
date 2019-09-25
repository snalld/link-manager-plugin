export const dispatchEvent = (type, data) => {
  var event = new CSEvent(type, "APPLICATION");
  event.data = data;
  csInterface.dispatchEvent(event);
};
