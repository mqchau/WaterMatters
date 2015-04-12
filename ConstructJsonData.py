
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
						"TotalPopulation" : float(ThisLine[3]) ,
						"DomesticUsageFreshWater" : float(ThisLine[4]) ,
						"PublicSupply": float(ThisLine[5]),
						"Industrial": float(ThisLine[6]),
						"Irrigation": float(ThisLine[7]),
						"IrrigationCrop": float(ThisLine[8]),
						"Livestock": float(ThisLine[9]),
						"Aquaculture": float(ThisLine[10]),
						"Mining": float(ThisLine[11]),
						"ThermalElectric": float(ThisLine[12]),
						"ThermalElectricOneThrough": float(ThisLine[13]),
						"ThermalElectricRecirculation": float(ThisLine[14]),
						"TotalGroundWater": float(ThisLine[15]),
						"TotalFreshWater": float(ThisLine[16])
						}
					#{
					#    "Year": 2005,
					#    "DomesticUsage" : float(ThisLine[10]) ,
					#    "TotalSupplyOfFreshWater" : float(ThisLine[11]),
					#    "TotalPopulation" : float(ThisLine[12]),
					#    "TotalGroundWater" : float(ThisLine[13]),
					#    "TotalConsumptionOfWater" : float(ThisLine[14])
					#    },
					#{
					#    "Year": 2000,
					#    "DomesticUsage" : float(ThisLine[17]),
					#    "TotalSupplyOfFreshWater" : float(ThisLine[18]),
					#    "TotalPopulation" : float(ThisLine[19]),
					#    "TotalGroundWater" : float(ThisLine[20])
					#},
					#{
					#    "Year": 1995,
					#    "DomesticUsage" : float(ThisLine[23]) ,
					#    "TotalSupplyOfFreshWater" : float(ThisLine[24]),
					#    "TotalPopulation" : float(ThisLine[25]),
					#    "TotalGroundWater" : float(ThisLine[26]),
					#    "TotalConsumptionOfWater" : float(ThisLine[27])
					#}]
					]
				}
			insertWaterSupplyDemandTable(WaterSupplyDemandTable,newrow)
		except Exception as e:
			import pprint
			pp = pprint.PrettyPrinter(indent=4)
			print "Can't process this line: %s " % pp.pformat(ThisLine)
			#break
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


