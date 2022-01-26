const urlRegex = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
);

const promptMessages = new Map();
promptMessages.set("loading", "Loading links from #...");
promptMessages.set("cantNavigate", "# does not allow navigation.");
promptMessages.set("nothingNew", "Nothing new in #.");
promptMessages.set("deadEnd", "# is a dead end.");

export { urlRegex, promptMessages };
