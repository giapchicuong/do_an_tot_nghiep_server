class HelpFunction {

    static calculatorPercentTotalWithYesterday = (today, yesterday) => {
        if (yesterday === 0) {
            return today === 0 ? 0 : 100;
        }

        const result = ((today - yesterday) / yesterday) * 100;
        return Math.round(result * 100) / 100;
    }
}
export default HelpFunction;
