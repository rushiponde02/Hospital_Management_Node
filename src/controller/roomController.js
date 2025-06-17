const Room = require('../models/roomModel');

exports.renderAddRoom = (req, res) => {
  res.render("addroom");
};

exports.addRoom = (req, res) => {
  console.log("Room Form Data:", req.body);
  Room.addRoom(req.body, (err) => {
    if (err) {
      console.error("Error saving room:", err);
      return res.status(500).send("Error saving room");
    }
    res.redirect("/reception/add-room");
  });
};



exports.viewRoom = (req, res) => {
  Room.getAllRooms((err, results) => {
    if (err) 
        return res.status(500).send("Error fetching rooms");
    res.render("viewroom", { rooms: results });
  });
};

exports.renderEditRoom = (req, res) => {
  const room_no = req.params.room_no;
  Room.getRoomByNo(room_no, (err, results) => {
    if (err || results.length === 0) return res.status(404).send("Room not found");
    res.render("editroom", { room: results[0] });
  });
};

// Handle update form submission
exports.updateRoom = (req, res) => {
  const room_no = req.params.room_no;
  Room.updateRoom(room_no, req.body, (err) => {
    if (err) return res.status(500).send("Update failed");
    res.redirect("/reception/view-rooms");
  });
};

// Handle delete
exports.deleteRoom = (req, res) => {
  const room_no = req.params.room_no;
  Room.deleteRoom(room_no, (err) => {
    if (err) return res.status(500).send("Delete failed");
    res.redirect("/reception/view-rooms");
  });
};

exports.searchRoom = (req, res) => {
  const roomNo = req.query.room_no || "";
  Room.searchRoomByNumber(roomNo, (err, results) => {
    if (err) {
      console.error("Error searching room:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
};