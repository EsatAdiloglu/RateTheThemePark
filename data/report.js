import { ObjectId } from "mongodb";
import helper from "../helper.js";
import { themeparks, rides, foodstalls, reports } from "../config/mongoCollections.js";

const createReport = async (
    userName,
    thingId,
    reportBody,
    option
) => {
    userName = helper.checkString(userName);
    thingId = helper.checkId(thingId);
    reportBody = helper.checkString(reportBody);

    if (typeof option !== 'number') throw "Error: option isn't of type number";

    const reportCollections = await reports();
    let collection = undefined;
    let name = undefined;

    switch (option) {
        case 0:
            collection = await themeparks();
            name = "theme park";
            break;
        case 1:
            collection = await rides();
            name = "ride";
            break;
        case 2:
            collection = await foodstalls();
            name = "food stall";
            break;
        case 3:
            collection = reportCollections;
            name = "report";
            break;
        default:
            throw "Error: option out of bounds";
    }
    const thing = await collection.findOne({ _id: new ObjectId(thingId) });
    if (thing === null) throw `Error: the ${name} that is being reported on doesn't have the id of ${thingId}`;

    const newReport = {
        userName: userName,
        thingId: thingId,
        reportBody: reportBody,
        reports: []
    };

    const reportInfo = await reportCollections.insertOne(newReport);
    if (!reportInfo.acknowledged || !reportInfo.insertedId) throw `Error: could not add a new report to the ${name}`;

    const reportId = reportInfo.insertedId.toString();

    const updatedReports = { reports: [...thing.reports, reportId] };
    const updatedReportsResult = await collection.findOneAndUpdate(
        { _id: new ObjectId(thingId) },
        { $set: updatedReports }
    );

    if (!updatedReportsResult) throw `Error: could not add report to the ${name}`;

    return reportId;
};

const getReports = async (id) => {
    id = helper.checkId(id);

    const reportCollections = await reports();
    const reportArray = await reportCollections.find({ thingId: id }).toArray();

    const formattedReports = reportArray.map((report) => ({
        _id: report._id.toString(),
        userName: report.userName,
        thingId: report.thingId,
        reportBody: report.reportBody,
        reports: report.reports
    }));

    for (let i = 0; i < formattedReports.length; i++) {
        const report = formattedReports[i];
        const childReportArray = await reportCollections.find({ thingId: report._id }).toArray();

        report.reports = childReportArray.map((child) => ({
            _id: child._id.toString(),
            userName: child.userName,
            thingId: child.thingId,
            reportBody: child.reportBody,
            reports: child.reports
        }));

        formattedReports[i] = report;
    }

    return {
        thingId: id,
        reports: formattedReports
    };
};

export default { createReport, getReports };