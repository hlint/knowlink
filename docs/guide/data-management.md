# Data Management

![Data Management Interface](/data.png)

The data management feature allows you to import, export, and clean application data, ensuring your information security and system performance.

## Bookmark Import

Import bookmark data from browsers, supporting multiple formats:

### Supported Formats

- **Netscape Bookmark Format**: Compatible with Firefox, Google Chrome, and other mainstream browsers
- **Pocket Format**: Supports data exported from getpocket.com

### Import Steps

1. Manually export bookmark files from your browser (usually in `bookmarks.html` format)
2. Select "Import Bookmarks" function in the application
3. Choose the exported bookmark file
4. The system will automatically parse and import your bookmark data

## Resource Cleanup

### Clean Upload Files

Clean unused resource files in the upload folder to free up storage space and improve system performance.

**Note**: This operation will permanently delete unused files. Please ensure you no longer need these files.

## Data Export

### Export Data

Export all your data as a file, download format is SQLite database file.

**Uses**:

- Data backup
- Migration to other devices
- Data analysis and inspection

**View Exported Data**:
You can use tools like [SQLite Viewer](https://sqliteviewer.app/) to view the contents of exported database files.

## Data Import

### Import Database

Import data from database files (such as `knowlink.06-27.db`) to the current system.

**Important Warning**:

- This operation will replace your current database
- Please backup existing data before performing the operation
- The import process is irreversible, please proceed with caution

### Import Steps

1. Prepare the database file to be imported
2. Select "Import Database" function in the application
3. Choose the database file
4. Confirm the import operation
5. Wait for import completion

## Notes

- Before performing any data operations, it's recommended to backup important data first
- Import operations will overwrite existing data, please ensure you understand the impact of the operation
- If you encounter issues, please seek help on the [Contact Us](/contact) page
