# CSV Data Comparison and Export

This Node.js script allows you to read, compare, and export differences from multiple CSV files containing data related to visa processing. The script reads data from CSV files organized by date and performs comparisons between consecutive dates to identify changes in the data. It specifically focuses on cases where a visa application has been refused under section 221(g) of the Immigration and Nationality Act. The script outputs the differences in both JSON and CSV formats.

## Acknowledgment

The CSV files used in this project are provided by [Xarthisius](https://dvcharts.xarthisius.xyz/), and we sincerely appreciate their efforts in collecting and sharing this data.

## Installation

Before using the script, ensure you have Node.js and npm (Node Package Manager) installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

1. Clone this repository to your local machine.

```bash
git clone git@github.com:lawyer-omer/dv-221g-ap-tracker.git
````
2. Navigate to the repository folder using the command line.

```bash
cd dv-221g-ap-tracker
````
3. Install the required dependencies by running:

```bash
npm install csv-parser fs
````


## Usage

1. Place the CSV files you want to compare in the appropriate folders and update the `csvFiles` array in the script with the relevant paths and dates.

2. Run the script using the following command:

```bash
node compare.js
```


3. The script will process the data, compare it across dates, and generate JSON and CSV files containing the identified differences. The exported files will be named `differences.json` and `differences.csv`.

## Features

- Reads and organizes data from multiple CSV files by date.
- Compares data across dates to identify changes in visa processing status.
- Tracks and calculates the duration for cases affected by 221(g) refusals.
- Exports differences in both JSON and CSV formats.

## Contributing

Contributions to this script are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This script is licensed under the [MIT License](LICENSE). You are free to modify and use it according to the terms of the license.
