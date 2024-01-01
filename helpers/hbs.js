const moment = require("moment-timezone");

module.exports = {
  formatDate: function (date, format) {
    const dhakaTime = moment(date).utc().tz("Asia/Dhaka");
    return dhakaTime.format(format);
  },
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + " ";
      new_str = str.substr(0, len);
      new_str = str.substr(0, new_str.lastIndexOf(" "));
      new_str = new_str.length > 0 ? new_str : str.substr(0, len);
      return new_str + "...";
    }
    return str;
  },
  stripTags: function (input) {
    return input.replace(/<(?:.|\n)*?>/gm, "");
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) {
    // Check if storyUser, loggedUser, or storyId is null or undefined
    if (!storyUser || !loggedUser || !storyId) {
      return "";
    }

    // Proceed with the comparison only if _id property exists in both objects
    if (
      storyUser._id &&
      loggedUser._id &&
      storyUser._id.toString() === loggedUser._id.toString()
    ) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return "";
    }
  },
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp(">" + selected + "</option>"),
        ' selected="selected"$&'
      );
  },
};
