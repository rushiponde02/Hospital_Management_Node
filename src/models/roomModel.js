const db = require("../config/db");

exports.addRoom = (data = {}, callback) => {
  const { room_no, room_type, room_status, charges_per_day } = data;

  const sql = `
    INSERT INTO room (room_no, room_type, room_status, charges_per_day)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [room_no, room_type, room_status, charges_per_day], callback);
};


exports.getAllRooms = (callback) => {
  db.query("SELECT * FROM room", callback);
};

exports.getRoomByNo = (room_no, callback) => {
  db.query("SELECT * FROM room WHERE room_no = ?", [room_no], callback);
};

// Update a room
exports.updateRoom = (room_no, data, callback) => {
  const { room_type, room_status, charges_per_day } = data;
  db.query(
    "UPDATE room SET room_type = ?, room_status = ?, charges_per_day = ? WHERE room_no = ?",
    [room_type, room_status, charges_per_day, room_no],
    callback
  );
};

// Delete a room
exports.deleteRoom = (room_no, callback) => {
  db.query("DELETE FROM room WHERE room_no = ?", [room_no], callback);
};

exports.searchRoomByNumber = (roomNo, callback) => {
  const query = `SELECT * FROM room WHERE room_no LIKE ?`;
  const searchTerm = `%${roomNo}%`;
  db.query(query, [searchTerm], callback);
};
