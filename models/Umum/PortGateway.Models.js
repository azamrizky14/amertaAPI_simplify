const mongoose = require("mongoose");

const PortGatewaySchema = mongoose.Schema(
  {
    PortGateway_id: {
      type: String,
    },
    PortGateway_nama: {
      type: String,
    },
    PortGateway_tipe: {
      type: String,
    },
    PortGateway_port: {
      type: String,
    },
    PortGateway_status: {
      type: String,
    },
    PortGateway_user_created: {
      type: String,
    },
    PortGateway_created: {
      type: String,
    },
    PortGateway_updated: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const PortGateway = mongoose.model("portgateway", PortGatewaySchema);

module.exports = PortGateway;
