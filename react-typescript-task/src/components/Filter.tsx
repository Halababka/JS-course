import React from "react";
import { VehicleFilter, VehicleType } from "../data/vehicles/contracts";
import { Gapped, Input } from "@skbkontur/react-ui";
import { VehicleTypeSelect } from "./VehicleTypeSelect";

interface FilterProps {
    filter: VehicleFilter;
    onChange: (filter: VehicleFilter) => void;
}

export class Filter extends React.Component<FilterProps> {
    render(): React.ReactNode {
        return (
            <Gapped>
                <Input
                    value={this.props.filter.title}
                    onValueChange={this.handleTitleChange}
                />
                <VehicleTypeSelect
                    value={this.props.filter.type}
                    onChange={this.handleTypeChange}
                />
            </Gapped>
        );
    }

    private handleTitleChange = (title: string): void => {
        this.props.onChange({ ...this.props.filter, title });
    };

    private handleTypeChange = (type: VehicleType | null): void => {
        this.props.onChange({ ...this.props.filter, type });
    };
}
