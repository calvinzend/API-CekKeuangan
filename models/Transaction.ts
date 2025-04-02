import { Table, Column, Model, DataType } from "sequelize-typescript";

export type TransactionType = "income" | "expense";

@Table({
  tableName: "transactions",
  timestamps: true, // otomatis tambahkan createdAt dan updatedAt
  paranoid: true, // enable soft delete (akan tambahkan deletedAt)
})
export class Transaction extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4, // generate UUID otomatis
  })
  declare id: string;

  @Column({
    type: DataType.ENUM('income', 'expense'),
    allowNull: false
  })
  declare type: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: { min: 0 }
  })
  declare amount: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW, // tanggal hari ini sebagai default
  })
  declare date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare category: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true, // opsional
  })
  declare description: string | null;

  // Untuk soft delete
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt: Date | null;
}