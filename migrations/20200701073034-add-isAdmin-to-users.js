"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Users", "isAdmin", {
      type: Sequelize.BOOLEAN,
      dafaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "isAdmin");
  },
};
