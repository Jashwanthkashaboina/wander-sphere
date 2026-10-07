const calculatePlanStability = (
    originalActivities,
    newActivities
) => {

    if (originalActivities.length === 0) {
        return 0;
    }

    const originalPOIs = originalActivities.map(
        activity => activity.poiId.toString()
    );

    const newPOIs = newActivities.map(
        activity => activity.poiId.toString()
    );

    let unchangedActivities = 0;

    for (const poiId of originalPOIs) {

        if (newPOIs.includes(poiId)) {
            unchangedActivities++;
        }

    }

    return (
        unchangedActivities /
        originalPOIs.length
    );
};


module.exports = calculatePlanStability;