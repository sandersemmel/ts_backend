import {DataTypes, Sequelize} from 'sequelize';
import * as database from '../database/database';
import { ReviewFields, BusinessFields, PaymentFields } from 'common';

  export const Business = database.seq.define('Business', {
    // Model attributes are defined here
    [BusinessFields.email]: {
      type: DataTypes.STRING,
      allowNull: false
    },
    [BusinessFields.password]: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      [BusinessFields.businessName] :{
        type: DataTypes.STRING,
        allowNull: false
      }

  }, {

    // Other model options go here
  });



  export const Review = database.seq.define('Review', {
    [ReviewFields.reviewtext]: {
      type: DataTypes.STRING(2000),
      allowNull: false
    },
    [ReviewFields.acknowledged]: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    
  })

  export const Payment = database.seq.define('Payment', {
      [PaymentFields.paymenttime]:{
        type: DataTypes.BIGINT
      },
      [PaymentFields.paymentOK]: {
        type: DataTypes.BOOLEAN
      }, 
  }, {
        // Other model options go here
  })





// # BusinessID field gets created for Review-table
Business.hasMany(Review);
Business.hasMany(Payment);




//Biz.belongsTo(City);
//City.hasMany(Biz);

//Location.belongsTo(City);
//City.hasMany(Location);

//Location.hasMany(Qr);
//Qr.belongsTo(Location);

//Device.belongsTo(DeviceType,{onDelete: 'cascade', onUpdate: 'cascade'});
//DeviceType.hasMany(Device, {onDelete: 'cascade', onUpdate: 'cascade'});


//User.hasOne(Device);

