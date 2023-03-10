import { Chip } from 'primereact/chip';
import React from 'react'

const CustomChip = ({label}) => {
	return (
		<Chip
			className='my-1 mr-1'
			style={{
				borderRadius: '6px',
				background: '#9C27B022'
			}}
			label={label}
		>
		</Chip>
	)
}

export default CustomChip;