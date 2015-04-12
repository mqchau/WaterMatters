
def initializeWaterSupplyDemandTable():
	return []

def insertWaterSupplyDemandTable(table, onerow):
	table.append(onerow)	

def convertWaterSupplyDemandData(Lines):
	CurrentState = None
	CurrentCounty = None
	CurrentInfo = None
	WaterSupplyDemandTable = initializeWaterSupplyDemandTable()
	for lineidx in xrange(1,len(Lines)):
		ThisLine = Lines[lineidx].split(',')
		if len(ThisLine) < 20:
			break
		try:
			newrow = {
				"StateAbbr": ThisLine[0],
				"County": ThisLine[1],
				"InfoByYear": [
					{
						"Year": 2010,
						"DomesticUsage" : ThisLine[3],
						"TotalSupplyOfFreshWater" : ThisLine[4],
						"TotalPopulation" : ThisLine[5],
						"TotalConsumptionOfWater" : ThisLine[6]
						},
					{
						"Year": 2005,
						"DomesticUsage" : ThisLine[10],
						"TotalSupplyOfFreshWater" : ThisLine[11],
						"TotalPopulation" : ThisLine[12],
						"TotalConsumptionOfWater" : ThisLine[13]
						},
					{
						"Year": 1995,
						"DomesticUsage" : ThisLine[16],
						"TotalSupplyOfFreshWater" : ThisLine[17],
						"TotalPopulation" : ThisLine[18],
						"TotalConsumptionOfWater" : ThisLine[19]
					}]
				}
			insertWaterSupplyDemandTable(WaterSupplyDemandTable,newrow)
		except Exception as e:
			print "Can't process this line: %s " % Lines[lineidx]
			pass

	return WaterSupplyDemandTable

if __name__ == "__main__":
	import argparse,json
	parser = argparse.ArgumentParser()
	parser.add_argument('--dataset', required=True, type=int, help='an integer for the selection of data set')

	args = parser.parse_args()
	print("You select to process dataset number %d" % args.dataset)
	if args.dataset == 1:
		filename = "Water consumption.csv"
	with open(filename, 'r') as f:
		AllLine = f.readlines()[0].split('\r')
	if args.dataset == 1:
		ProcessedData = convertWaterSupplyDemandData(AllLine)
		OutputFileName = "WaterSupplyDemandData.js"
		OutputVariableName = "WaterSupplyDemandData"

	with open(OutputFileName, "w") as f:
		f.write('''
			var %s = %s;

			module.exports = {
				%s : %s
			};
			''' %( OutputVariableName, json.dumps(ProcessedData, indent=4), OutputVariableName, OutputVariableName))


